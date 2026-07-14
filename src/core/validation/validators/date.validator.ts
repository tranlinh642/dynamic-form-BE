import { FieldEntity } from '../../entities/field.entity';
import { IFieldValidator } from '../field-validator.interface';

export class DateValidator implements IFieldValidator {
  validate(value: any, field: FieldEntity): string | null {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return `Trường ${field.label} phải là một ngày tháng hợp lệ (ISO format).`;
    }

    if (field.validation) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (field.validation.minDate) {
        const minD = field.validation.minDate === 'today' ? today : new Date(field.validation.minDate);
        if (date.getTime() < minD.getTime()) {
          return `Trường ${field.label} không được nhỏ hơn ${field.validation.minDate === 'today' ? 'ngày hiện tại' : field.validation.minDate}.`;
        }
      }
      if (field.validation.maxDate) {
        const maxD = field.validation.maxDate === 'today' ? today : new Date(field.validation.maxDate);
        if (date.getTime() > maxD.getTime()) {
          return `Trường ${field.label} không được lớn hơn ${field.validation.maxDate === 'today' ? 'ngày hiện tại' : field.validation.maxDate}.`;
        }
      }
    }

    return null;
  }
}
