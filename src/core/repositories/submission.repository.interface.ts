import { SubmissionEntity } from '../entities/submission.entity';

export const ISUBMISSION_REPOSITORY_TOKEN = Symbol('ISubmissionRepository');

export interface ISubmissionRepository {
  createWithAnswers(
    submission: Partial<SubmissionEntity>,
    answers: any[],
  ): Promise<SubmissionEntity>;

  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ data: SubmissionEntity[]; total: number }>;

  findAll(
    page: number,
    limit: number,
  ): Promise<{ data: SubmissionEntity[]; total: number }>;
}
