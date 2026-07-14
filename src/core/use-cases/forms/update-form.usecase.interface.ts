import { FormEntity } from 'src/core/entities/form.entity';
import { FormStatus } from 'src/shared/enums/form-status.enum';

export type UpdateFormCommand = {
  title?: string;
  description?: string;
  order?: number;
  status?: FormStatus;
};

export interface IUpdateFormUseCase {
  execute(id: string, command: UpdateFormCommand): Promise<FormEntity>;
}
