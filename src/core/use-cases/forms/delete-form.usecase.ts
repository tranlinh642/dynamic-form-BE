import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IFORM_REPOSITORY_TOKEN } from 'src/core/repositories/form.repository.interface';
import type { IFormRepository } from 'src/core/repositories/form.repository.interface';
import { IDeleteFormUseCase } from './delete-form.usecase.interface';

@Injectable()
export class DeleteFormUseCase implements IDeleteFormUseCase {
  constructor(
    @Inject(IFORM_REPOSITORY_TOKEN)
    private readonly formRepository: IFormRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingForm = await this.formRepository.findById(id);
    if (!existingForm) {
      throw new NotFoundException(`Form với ID ${id} không tồn tại`);
    }

    await this.formRepository.delete(id);
  }
}
