import { FieldEntity } from '../entities/field.entity';

export interface IFieldValidator {
  validate(value: any, field: FieldEntity): string | null;
}
