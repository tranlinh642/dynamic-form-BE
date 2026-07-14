export interface IDeleteFormUseCase {
  execute(id: string): Promise<void>;
}
