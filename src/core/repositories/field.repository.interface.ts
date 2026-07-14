import { FieldEntity } from '../entities/field.entity';

export const IFIELD_REPOSITORY_TOKEN = Symbol('IFieldRepository');

export interface IFieldRepository {
  findByFormId(formId: string): Promise<FieldEntity[]>;
  findById(id: string): Promise<FieldEntity | null>;
  create(data: Partial<FieldEntity>): Promise<FieldEntity>;
  update(id: string, data: Partial<FieldEntity>): Promise<FieldEntity>;
  delete(id: string): Promise<void>;
}
