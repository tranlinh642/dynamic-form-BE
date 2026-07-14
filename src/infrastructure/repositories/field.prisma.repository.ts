import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IFieldRepository } from '../../core/repositories/field.repository.interface';
import { FieldEntity } from '../../core/entities/field.entity';
import { FieldType } from '../../shared/enums/field-type.enum';

@Injectable()
export class FieldPrismaRepository implements IFieldRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByFormId(formId: string): Promise<FieldEntity[]> {
    const rawFields = await this.prisma.fields.findMany({
      where: { form_id: formId },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    return rawFields.map(this.mapToEntity);
  }

  async findById(id: string): Promise<FieldEntity | null> {
    const rawField = await this.prisma.fields.findUnique({ where: { id } });
    if (!rawField) return null;
    return this.mapToEntity(rawField);
  }

  async create(data: Partial<FieldEntity>): Promise<FieldEntity> {
    const created = await this.prisma.fields.create({
      data: {
        form_id: data.formId!,
        label: data.label!,
        type: data.type!,
        order: data.order ?? 0,
        is_required: data.isRequired ?? false,
        options: data.options ?? null,
        validation: data.validation ?? null,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<FieldEntity>): Promise<FieldEntity> {
    const updated = await this.prisma.fields.update({
      where: { id },
      data: {
        label: data.label,
        type: data.type,
        order: data.order,
        is_required: data.isRequired,
        options: data.options,
        validation: data.validation,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.fields.delete({ where: { id } });
  }

  async updateOrders(orders: { id: string; order: number }[]): Promise<void> {
    await this.prisma.$transaction(
      orders.map((o) =>
        this.prisma.fields.update({
          where: { id: o.id },
          data: { order: o.order },
        }),
      ),
    );
  }

  private mapToEntity(prismaField: any): FieldEntity {
    return new FieldEntity(
      prismaField.id,
      prismaField.form_id,
      prismaField.label,
      prismaField.type as FieldType,
      prismaField.order,
      prismaField.is_required,
      prismaField.options,
      prismaField.validation,
    );
  }
}
