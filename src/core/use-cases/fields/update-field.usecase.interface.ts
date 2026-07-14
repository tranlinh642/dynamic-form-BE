import { FieldEntity } from 'src/core/entities/field.entity';
import { FieldType } from 'src/shared/enums/field-type.enum';

export type UpdateFieldCommand = {
  label?: string;
  type?: FieldType;
  order?: number;
  isRequired?: boolean;
  options?: any;
};

export interface IUpdateFieldUseCase {
  execute(formId: string, fieldId: string, command: UpdateFieldCommand): Promise<FieldEntity>;
}
