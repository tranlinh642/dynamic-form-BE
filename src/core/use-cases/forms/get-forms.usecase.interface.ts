import { FormEntity } from 'src/core/entities/form.entity';
import { FormStatus } from 'src/shared/enums/form-status.enum';

export type GetFormsQuery = {
  page: number;
  limit: number;
  status?: FormStatus;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
};

export interface IGetFormsUseCase {
  execute(query: GetFormsQuery): Promise<PaginatedResult<FormEntity>>;
}
