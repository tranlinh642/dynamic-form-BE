import { SubmissionEntity } from '../../entities/submission.entity';

export type SubmitFormCommand = {
  formId: string;
  answers: {
    fieldId: string;
    value: string;
  }[];
};

export interface ISubmitFormUseCase {
  execute(
    userId: string,
    command: SubmitFormCommand,
  ): Promise<SubmissionEntity>;
}
