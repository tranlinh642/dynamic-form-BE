import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class NumberValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    const num = Number(value);

    if (isNaN(num)) {
      return `Trường ${field.label} phải là một số hợp lệ.`;
    }

    if (field.validation) {
      if (field.validation.min !== undefined && num < field.validation.min) {
        return `Trường ${field.label} tối thiểu phải là ${field.validation.min}.`;
      }
      if (field.validation.max !== undefined && num > field.validation.max) {
        return `Trường ${field.label} tối đa là ${field.validation.max}.`;
      }
    }

    return null;
  }
}
