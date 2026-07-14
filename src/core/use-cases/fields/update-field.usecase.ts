import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FieldEntity } from 'src/core/entities/field.entity';
import { IFIELD_REPOSITORY_TOKEN } from 'src/core/repositories/field.repository.interface';
import type { IFieldRepository } from 'src/core/repositories/field.repository.interface';
import { IUpdateFieldUseCase, UpdateFieldCommand } from './update-field.usecase.interface';
import { FieldType } from 'src/shared/enums/field-type.enum';

@Injectable()
export class UpdateFieldUseCase implements IUpdateFieldUseCase {
  constructor(
    @Inject(IFIELD_REPOSITORY_TOKEN)
    private readonly fieldRepository: IFieldRepository,
  ) {}

  async execute(formId: string, fieldId: string, command: UpdateFieldCommand): Promise<FieldEntity> {
    const existingField = await this.fieldRepository.findById(fieldId);
    if (!existingField || existingField.formId !== formId) {
      throw new NotFoundException(`Field với ID ${fieldId} không tồn tại trong form ${formId}`);
    }

    const typeToCheck = command.type || existingField.type;
    const optionsToCheck = command.options !== undefined ? command.options : existingField.options;

    if (typeToCheck === FieldType.SELECT && (!optionsToCheck || !Array.isArray(optionsToCheck) || optionsToCheck.length === 0)) {
      throw new BadRequestException('Field dạng select yêu cầu phải có mảng options');
    }

    return await this.fieldRepository.update(fieldId, {
      label: command.label,
      type: command.type,
      order: command.order,
      isRequired: command.isRequired,
      options: command.options,
    });
  }
}
