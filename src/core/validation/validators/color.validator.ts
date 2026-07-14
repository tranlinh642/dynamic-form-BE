import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class ColorValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    if (typeof value !== 'string') {
      return `Trường ${field.label} phải là định dạng mã màu HEX.`;
    }
    
    const hexRegex = /^#[0-9A-Fa-f]{6}$/i;
    
    if (!hexRegex.test(value)) {
      return `Trường ${field.label} không đúng định dạng mã màu HEX (VD: #FFFFFF).`;
    }
    
    return null;
  }
}
