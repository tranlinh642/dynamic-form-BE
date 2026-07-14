import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ISubmissionRepository } from '../../core/repositories/submission.repository.interface';
import { SubmissionEntity } from '../../core/entities/submission.entity';
import { SubmissionAnswerEntity } from '../../core/entities/submission-answer.entity';

@Injectable()
export class SubmissionPrismaRepository implements ISubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithAnswers(
    submission: Partial<SubmissionEntity>,
    answers: Partial<SubmissionAnswerEntity>[]
  ): Promise<SubmissionEntity> {
    const created = await this.prisma.submissions.create({
      data: {
        form_id: submission.formId!,
        user_id: submission.userId!,
        submission_answers: {
          create: answers.map(a => ({
            field_id: a.fieldId!,
            value: a.value!,
          })),
        },
      },
      include: { submission_answers: true },
    });
    return this.mapToEntity(created);
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<{ data: SubmissionEntity[], total: number }> {
    const skip = (page - 1) * limit;
    const [total, rawSubmissions] = await Promise.all([
      this.prisma.submissions.count({ where: { user_id: userId } }),
      this.prisma.submissions.findMany({
        where: { user_id: userId },
        skip,
        take: limit,
        orderBy: { submitted_at: 'desc' },
        include: { submission_answers: true },
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
    if (prismaSub.submission_answers) {
      entity.answers = prismaSub.submission_answers.map((a: any) => new SubmissionAnswerEntity(
        a.id,
        a.submission_id,
        a.field_id,
        a.value
      ));
    }
    return entity;
  }
}
