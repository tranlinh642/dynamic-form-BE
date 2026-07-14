export interface IDeleteFieldUseCase {
  execute(formId: string, fieldId: string): Promise<void>;
}
