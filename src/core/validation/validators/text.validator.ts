import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class TextValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    if (typeof value !== 'string') {
      return `Trường ${field.label} phải là định dạng chuỗi.`;
    }
    
    if (value.length > 200) {
      return `Trường ${field.label} không được vượt quá 200 ký tự (hiện tại: ${value.length}).`;
    }
    
    return null;
  }
}
