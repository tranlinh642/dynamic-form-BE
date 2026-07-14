import { Inject, Injectable } from '@nestjs/common';
import { FormEntity } from 'src/core/entities/form.entity';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import { IGetFormsUseCase, GetFormsQuery, PaginatedResult } from './get-forms.usecase.interface';

@Injectable()
export class GetFormsUseCase implements IGetFormsUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(query: GetFormsQuery): Promise<PaginatedResult<FormEntity>> {
    const { page, limit, status } = query;
    return await this.formRepository.findAll(page, limit, status);
  }
}
