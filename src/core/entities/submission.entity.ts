import { SubmissionAnswerEntity } from './submission-answer.entity';

export class SubmissionEntity {
  constructor(
    public readonly id: string,
    public readonly formId: string,
    public readonly userId: string,
    public readonly submittedAt: Date,
    public answers?: SubmissionAnswerEntity[],
  ) {}
}
