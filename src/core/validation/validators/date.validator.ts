import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class DateValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return `Trường ${field.label} phải là một ngày tháng hợp lệ (ISO format).`;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    if (date < today) {
      return `Trường ${field.label} không được là ngày trong quá khứ.`;
    }
    
    return null;
  }
}
