import { Inject, Injectable } from '@nestjs/common';
import { IGetSubmissionsUseCase } from './get-submissions.usecase.interface';
import { SubmissionEntity } from '../../entities/submission.entity';
import { ISUBMISSION_REPOSITORY_TOKEN } from '../../repositories/submission.repository.interface';
import type { ISubmissionRepository } from '../../repositories/submission.repository.interface';

@Injectable()
export class GetSubmissionsUseCase implements IGetSubmissionsUseCase {
  constructor(
    @Inject(ISUBMISSION_REPOSITORY_TOKEN)
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(userId: string, page: number, limit: number): Promise<{ data: SubmissionEntity[], total: number }> {
    return await this.submissionRepository.findByUserId(userId, page, limit);
  }
}
