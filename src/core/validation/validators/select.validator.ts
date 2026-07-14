import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class SelectValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    if (!field.options || !Array.isArray(field.options)) {
      return `Trường ${field.label} bị lỗi cấu hình (thiếu danh sách lựa chọn).`;
    }

    if (!field.options.includes(value)) {
      return `Giá trị của trường ${field.label} không nằm trong danh sách lựa chọn hợp lệ.`;
    }

    return null;
  }
}
