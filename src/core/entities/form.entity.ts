import { FormStatus } from '../../shared/enums/form-status.enum';
import { FieldEntity } from './field.entity';

export class FormEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public order: number,
    public status: FormStatus,
    public createdBy: string,
    public fields?: FieldEntity[],
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim() === '') {
      throw new Error('Tiêu đề form không được để trống');
    }
    if (this.title.length < 3 || this.title.length > 100) {
      throw new Error('Tiêu đề form phải có độ dài từ 3 đến 100 ký tự');
    }
    if (this.order < 0) {
      throw new Error('Thứ tự sắp xếp (order) không được là số âm');
    }
    if (!this.createdBy) {
      throw new Error(
        'Thông tin người tạo form (createdBy) không được để trống',
      );
    }
  }

  publish(): void {
    if (!this.fields || this.fields.length === 0) {
      throw new Error(
        'Không thể xuất bản form khi chưa có câu hỏi/trường dữ liệu nào',
      );
    }
    this.status = FormStatus.ACTIVE;
  }

  draft(): void {
    this.status = FormStatus.DRAFT;
  }
}
