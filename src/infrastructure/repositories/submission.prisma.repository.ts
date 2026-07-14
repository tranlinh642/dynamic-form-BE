import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ISubmissionRepository } from '../../core/repositories/submission.repository.interface';
import { SubmissionEntity } from '../../core/entities/submission.entity';

@Injectable()
export class SubmissionPrismaRepository implements ISubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithAnswers(
    submission: Partial<SubmissionEntity>,
    answers: any[],
  ): Promise<SubmissionEntity> {
    const created = await this.prisma.submissions.create({
      data: {
        form_id: submission.formId!,
        user_id: submission.userId!,
        answers: answers as any,
      },
    });
    return this.mapToEntity(created);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ data: SubmissionEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [total, rawSubmissions] = await Promise.all([
      this.prisma.submissions.count({ where: { user_id: userId } }),
      this.prisma.submissions.findMany({
        where: { user_id: userId },
        skip,
        take: limit,
        orderBy: { submitted_at: 'desc' },
        include: {
          forms: { select: { id: true, title: true } }, // include form title
          users: { select: { id: true, username: true, email: true } }, // include user info
        },
      }),
    ]);

    return {
      data: rawSubmissions.map(this.mapToEntity),
      total,
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: SubmissionEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [total, rawSubmissions] = await Promise.all([
      this.prisma.submissions.count(),
      this.prisma.submissions.findMany({
        skip,
        take: limit,
        orderBy: { submitted_at: 'desc' },
        include: {
          forms: { select: { id: true, title: true } },
          users: { select: { id: true, username: true, email: true } },
        },
      }),
    ]);

    return {
      data: rawSubmissions.map(this.mapToEntity),
      total,
    };
  }

  private mapToEntity(prismaSub: any): SubmissionEntity {
    const entity = new SubmissionEntity(
      prismaSub.id,
      prismaSub.form_id,
      prismaSub.user_id,
      prismaSub.submitted_at,
    );
    if (prismaSub.answers) {
      entity.answers = prismaSub.answers;
    } else {
      entity.answers = [];
    }
    if (prismaSub.forms) {
      (entity as any).form = {
        id: prismaSub.forms.id,
        title: prismaSub.forms.title,
      };
    }
    if (prismaSub.users) {
      (entity as any).user = {
        id: prismaSub.users.id,
        username: prismaSub.users.username,
        email: prismaSub.users.email,
      };
    }
    return entity;
  }
}
