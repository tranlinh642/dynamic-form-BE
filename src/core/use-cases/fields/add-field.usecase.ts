import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FieldEntity } from 'src/core/entities/field.entity';
import { IFIELD_REPOSITORY_TOKEN } from 'src/core/repositories/field.repository.interface';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFieldRepository } from 'src/core/repositories/field.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import { IAddFieldUseCase, AddFieldCommand } from './add-field.usecase.interface';
import { FieldType } from 'src/shared/enums/field-type.enum';

@Injectable()
export class AddFieldUseCase implements IAddFieldUseCase {
  constructor(
    @Inject(IFIELD_REPOSITORY_TOKEN)
    private readonly fieldRepository: IFieldRepository,
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(command: AddFieldCommand): Promise<FieldEntity> {
    const form = await this.formRepository.findById(command.formId);
    if (!form) {
      throw new NotFoundException(`Form với ID ${command.formId} không tồn tại`);
    }

    if (command.type === FieldType.SELECT && (!command.options || !Array.isArray(command.options) || command.options.length === 0)) {
      throw new BadRequestException('Field dạng select yêu cầu phải có mảng options');
    }

    return await this.fieldRepository.create({
      formId: command.formId,
      label: command.label,
      type: command.type,
      order: command.order ?? 0,
      isRequired: command.isRequired ?? false,
      options: command.options ?? null,
    });
  }
}
