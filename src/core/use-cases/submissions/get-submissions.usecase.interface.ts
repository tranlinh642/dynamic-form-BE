import { SubmissionEntity } from '../../entities/submission.entity';

export interface IGetSubmissionsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ data: SubmissionEntity[]; total: number }>;
}
