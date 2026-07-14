import { Inject, Injectable } from '@nestjs/common';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import {
  IUpdateFormOrdersUseCase,
  UpdateFormOrderCommand,
} from './update-form-orders.usecase.interface';

@Injectable()
export class UpdateFormOrdersUseCase implements IUpdateFormOrdersUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(orders: UpdateFormOrderCommand[]): Promise<void> {
    await this.formRepository.updateOrders(orders);
  }
}
