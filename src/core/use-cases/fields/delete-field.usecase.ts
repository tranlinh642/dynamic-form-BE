import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFIELD_REPOSITORY_TOKEN } from 'src/core/repositories/field.repository.interface';
import type { IFieldRepository } from 'src/core/repositories/field.repository.interface';
import { IDeleteFieldUseCase } from './delete-field.usecase.interface';

@Injectable()
export class DeleteFieldUseCase implements IDeleteFieldUseCase {
  constructor(
    @Inject(IFIELD_REPOSITORY_TOKEN)
    private readonly fieldRepository: IFieldRepository,
  ) {}

  async execute(formId: string, fieldId: string): Promise<void> {
    const existingField = await this.fieldRepository.findById(fieldId);
    if (!existingField || existingField.formId !== formId) {
      throw new NotFoundException(`Field với ID ${fieldId} không tồn tại trong form ${formId}`);
    }

    await this.fieldRepository.delete(fieldId);
  }
}
