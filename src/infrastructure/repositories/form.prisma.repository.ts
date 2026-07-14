import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IFormRepository } from '../../core/repositories/form.repository.interface';
import { FormEntity } from '../../core/entities/form.entity';
import { FormStatus } from '../../shared/enums/form-status.enum';

@Injectable()
export class FormPrismaRepository implements IFormRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(form: Partial<FormEntity>): Promise<FormEntity> {
    const created = await this.prisma.forms.create({
      data: {
        title: form.title!,
        description: form.description,
        order: form.order ?? 0,
        status: form.status!,
        created_by: form.createdBy!,
      },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<FormEntity | null> {
    const form = await this.prisma.forms.findUnique({
      where: { id },
      include: { fields: { orderBy: [{ order: 'asc' }, { id: 'asc' }] } },
    });
    if (!form) return null;
    return this.mapToEntity(form);
  }

  async findAll(
    page: number,
    limit: number,
    status?: FormStatus,
  ): Promise<{ data: FormEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereCondition = status ? { status } : {};
    const [total, rawForms] = await Promise.all([
      this.prisma.forms.count({ where: whereCondition }),
      this.prisma.forms.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: { fields: { orderBy: [{ order: 'asc' }, { id: 'asc' }] } },
      }),
    ]);
    return {
      data: rawForms.map(this.mapToEntity),
      total,
    };
  }

  async update(
    id: string,
    data: Partial<Omit<FormEntity, 'id' | 'createdBy'>>,
  ): Promise<FormEntity> {
    const updated = await this.prisma.forms.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        status: data.status,
      },
    });
    return this.mapToEntity(updated);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.forms.delete({
      where: { id },
    });
  }
  async updateOrders(orders: { id: string; order: number }[]): Promise<void> {
    await this.prisma.$transaction(
      orders.map((o) =>
        this.prisma.forms.update({
          where: { id: o.id },
          data: { order: o.order },
        }),
      ),
    );
  }
  private mapToEntity(prismaForm: any): FormEntity {
    const entity = new FormEntity(
      prismaForm.id,
      prismaForm.title,
      prismaForm.description,
      prismaForm.order,
      prismaForm.status as FormStatus,
      prismaForm.created_by,
    );
    if (prismaForm.fields) {
      entity.fields = prismaForm.fields.map((f: any) => ({
        id: f.id,
        formId: f.form_id,
        label: f.label,
        type: f.type,
        order: f.order,
        isRequired: f.is_required,
        options: f.options,
        validation: f.validation,
      }));
    }
    return entity;
  }
}
