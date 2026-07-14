import { SubmissionEntity } from '../entities/submission.entity';
import { SubmissionAnswerEntity } from '../entities/submission-answer.entity';

export const ISUBMISSION_REPOSITORY_TOKEN = Symbol('ISubmissionRepository');

export interface ISubmissionRepository {
  createWithAnswers(
    submission: Partial<SubmissionEntity>,
    answers: Partial<SubmissionAnswerEntity>[]
  ): Promise<SubmissionEntity>;

  findByUserId(userId: string, page: number, limit: number): Promise<{ data: SubmissionEntity[], total: number }>;
}
