import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IFIELD_REPOSITORY_TOKEN } from 'src/core/repositories/field.repository.interface';
import type { IFieldRepository } from 'src/core/repositories/field.repository.interface';
import {
  IUpdateFieldOrdersUseCase,
  UpdateFieldOrderCommand,
} from './update-field-orders.usecase.interface';

@Injectable()
export class UpdateFieldOrdersUseCase implements IUpdateFieldOrdersUseCase {
  constructor(
    @Inject(IFIELD_REPOSITORY_TOKEN)
    private readonly fieldRepository: IFieldRepository,
  ) {}

  async execute(
    formId: string,
    orders: UpdateFieldOrderCommand[],
  ): Promise<void> {
    const existingFields = await this.fieldRepository.findByFormId(formId);
    const existingFieldIds = new Set(existingFields.map((f) => f.id));

    for (const order of orders) {
      if (!existingFieldIds.has(order.id)) {
        throw new BadRequestException(
          `Field với ID ${order.id} không thuộc form ${formId} hoặc không tồn tại.`,
        );
      }
    }

    await this.fieldRepository.updateOrders(orders);
  }
}
