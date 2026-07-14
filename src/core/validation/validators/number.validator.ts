import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class NumberValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    const num = Number(value);
    
    if (isNaN(num)) {
      return `Trường ${field.label} phải là một số hợp lệ.`;
    }
    
    if (num < 0 || num > 100) {
      return `Trường ${field.label} phải nằm trong khoảng từ 0 đến 100 (nhận được: ${num}).`;
    }
    
    return null;
  }
}
