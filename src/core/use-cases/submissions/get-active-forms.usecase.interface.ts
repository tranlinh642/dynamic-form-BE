import { FormEntity } from '../../entities/form.entity';

export interface IGetActiveFormsUseCase {
  execute(
    page: number,
    limit: number,
  ): Promise<{ data: FormEntity[]; total: number }>;
}
