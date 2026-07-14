import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FormEntity } from 'src/core/entities/form.entity';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import { IGetFormByIdUseCase } from './get-form-by-id.usecase.interface';

@Injectable()
export class GetFormByIdUseCase implements IGetFormByIdUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(id: string): Promise<FormEntity> {
    const form = await this.formRepository.findById(id);
    if (!form) {
      throw new NotFoundException(`Form với ID ${id} không tồn tại`);
    }
    return form;
  }
}
