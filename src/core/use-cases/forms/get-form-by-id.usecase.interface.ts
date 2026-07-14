import { FormEntity } from 'src/core/entities/form.entity';

export interface IGetFormByIdUseCase {
  execute(id: string): Promise<FormEntity>;
}
