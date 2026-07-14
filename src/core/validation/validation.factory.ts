import { FieldType } from '../../shared/enums/field-type.enum';
import { IFieldValidator } from './field-validator.interface';
import { TextValidator } from './validators/text.validator';
import { NumberValidator } from './validators/number.validator';
import { DateValidator } from './validators/date.validator';
import { ColorValidator } from './validators/color.validator';
import { SelectValidator } from './validators/select.validator';

export class ValidationFactory {
  private static validators: Record<string, IFieldValidator> = {
    [FieldType.TEXT]: new TextValidator(),
    [FieldType.NUMBER]: new NumberValidator(),
    [FieldType.DATE]: new DateValidator(),
    [FieldType.COLOR]: new ColorValidator(),
    [FieldType.SELECT]: new SelectValidator(),
  };

  static getValidator(type: FieldType): IFieldValidator {
    const validator = this.validators[type];
    if (!validator) {
      throw new Error(`Không tìm thấy Validator cho loại trường: ${type}`);
    }
    return validator;
  }
}
