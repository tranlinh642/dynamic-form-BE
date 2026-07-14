import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FormEntity } from 'src/core/entities/form.entity';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import {
  IUpdateFormUseCase,
  UpdateFormCommand,
} from './update-form.usecase.interface';

@Injectable()
export class UpdateFormUseCase implements IUpdateFormUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(id: string, command: UpdateFormCommand): Promise<FormEntity> {
    const existingForm = await this.formRepository.findById(id);
    if (!existingForm) {
      throw new NotFoundException(`Form với ID ${id} không tồn tại`);
    }

    return await this.formRepository.update(id, {
      title: command.title,
      description: command.description,
      order: command.order,
      status: command.status,
    });
  }
}
