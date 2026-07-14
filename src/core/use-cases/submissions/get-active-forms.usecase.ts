import { Inject, Injectable } from '@nestjs/common';
import { IGetActiveFormsUseCase } from './get-active-forms.usecase.interface';
import { FormEntity } from '../../entities/form.entity';
import { IFORM_REPOSITORY_TOKEN } from '../../repositories/form.repository.interface';
import type { IFormRepository } from '../../repositories/form.repository.interface';
import { FormStatus } from '../../../shared/enums/form-status.enum';

@Injectable()
export class GetActiveFormsUseCase implements IGetActiveFormsUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(page: number, limit: number): Promise<{ data: FormEntity[], total: number }> {
    return await this.formRepository.findAll(page, limit, FormStatus.ACTIVE);
  }
}
