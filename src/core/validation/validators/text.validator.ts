import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class TextValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    if (typeof value !== 'string') {
      return `Trường ${field.label} phải là định dạng chuỗi.`;
    }

    let maxLength = 200; // default
    let minLength = 0;

    if (field.validation) {
      if (field.validation.maxLength !== undefined) maxLength = field.validation.maxLength;
      if (field.validation.minLength !== undefined) minLength = field.validation.minLength;
    }

    if (value.length > maxLength) {
      return `Trường ${field.label} không được vượt quá ${maxLength} ký tự (hiện tại: ${value.length}).`;
    }
    if (value.length < minLength) {
      return `Trường ${field.label} tối thiểu phải có ${minLength} ký tự (hiện tại: ${value.length}).`;
    }

    return null;
  }
}
