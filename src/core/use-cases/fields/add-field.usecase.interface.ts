import { FieldEntity } from 'src/core/entities/field.entity';
import { FieldType } from 'src/shared/enums/field-type.enum';

export type AddFieldCommand = {
  formId: string;
  label: string;
  type: FieldType;
  order?: number;
  isRequired?: boolean;
  options?: any;
  validation?: any;
};

export interface IAddFieldUseCase {
  execute(command: AddFieldCommand): Promise<FieldEntity>;
}
