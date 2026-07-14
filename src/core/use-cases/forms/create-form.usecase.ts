import { Inject, Injectable } from '@nestjs/common';
import { FormEntity } from 'src/core/entities/form.entity';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import { ICreateFormUseCase, CreateFormCommand } from './create-form.usecase.interface';
import { FormStatus } from 'src/shared/enums';

@Injectable()
export class CreateFormUseCase implements ICreateFormUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(
    command: CreateFormCommand,
    userId: string,
  ): Promise<FormEntity> {
    return await this.formRepository.create({
      title: command.title,
      description: command.description ?? null,
      order: command.order ?? 0,
      status: FormStatus.DRAFT,
      createdBy: userId,
    });
  }
}
