import { FormEntity } from 'src/core/entities/form.entity';
export type CreateFormCommand = {
  title: string;
  description?: string;
  order?: number;
};

export interface ICreateFormUseCase {
  execute(command: CreateFormCommand, userId: string): Promise<FormEntity>;
}
