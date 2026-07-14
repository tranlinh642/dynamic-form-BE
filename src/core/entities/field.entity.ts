import { FieldType } from '../../shared/enums/field-type.enum';

export class FieldEntity {
  constructor(
    public readonly id: string,
    public readonly formId: string,
    public label: string,
    public type: FieldType,
    public order: number,
    public isRequired: boolean,
    public options: any | null,
  ) {}
}
