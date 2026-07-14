import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ISubmitFormUseCase,
  SubmitFormCommand,
} from './submit-form.usecase.interface';
import { SubmissionEntity } from '../../entities/submission.entity';
import { IFORM_REPOSITORY_TOKEN } from '../../repositories/form.repository.interface';
import { ISUBMISSION_REPOSITORY_TOKEN } from '../../repositories/submission.repository.interface';
import type { IFormRepository } from '../../repositories/form.repository.interface';
import type { ISubmissionRepository } from '../../repositories/submission.repository.interface';
import { ValidationFactory } from '../../validation/validation.factory';
import { FormStatus } from '../../../shared/enums/form-status.enum';

@Injectable()
export class SubmitFormUseCase implements ISubmitFormUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
    @Inject(ISUBMISSION_REPOSITORY_TOKEN)
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(
    userId: string,
    command: SubmitFormCommand,
  ): Promise<SubmissionEntity> {
    const form = await this.formRepository.findById(command.formId);

    if (!form || form.status !== FormStatus.ACTIVE) {
      throw new NotFoundException(
        `Form với ID ${command.formId} không tồn tại hoặc chưa được kích hoạt.`,
      );
    }

    const errors: Record<string, string> = {};
    const parsedAnswers: any[] = [];

    const formFields = form.fields || [];

    for (const field of formFields) {
      const answer = command.answers.find((a) => a.fieldId === field.id);
      const value = answer ? answer.value : undefined;

      const isEmpty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

      // Required Check
      if (field.isRequired && isEmpty) {
        errors[field.id] = `Trường ${field.label} là bắt buộc.`;
        continue;
      }

      // Nếu không required và không có value thì bỏ qua validate
      if (isEmpty) {
        parsedAnswers.push({ fieldId: field.id, value: '' });
        continue;
      }

      // Strategy Type Validation
      const validator = ValidationFactory.getValidator(field.type);
      const error = validator.validate(value, field);

      if (error) {
        errors[field.id] = error;
      } else {
        parsedAnswers.push({
          fieldId: field.id,
          value: value,
        });
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Dữ liệu không hợp lệ',
        errors,
      });
    }

    return await this.submissionRepository.createWithAnswers(
      { formId: form.id, userId },
      parsedAnswers,
    );
  }
}
