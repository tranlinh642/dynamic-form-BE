export class SubmissionAnswerEntity {
  constructor(
    public readonly id: string,
    public readonly submissionId: string,
    public readonly fieldId: string,
    public value: string,
  ) {}
}
