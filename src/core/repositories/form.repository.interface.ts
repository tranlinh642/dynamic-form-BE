import { FormEntity } from '../entities/form.entity';
import { FormStatus } from '../../shared/enums/form-status.enum';

export const IFORM_REPOSITORY_TOKEN = Symbol('IFormRepository');

export interface IFormRepository {
  create(form: Partial<FormEntity>): Promise<FormEntity>;
  findById(id: string): Promise<FormEntity | null>;
  findAll(page: number, limit: number, status?: FormStatus): Promise<{ data: FormEntity[]; total: number }>;
  update(id: string, data: Partial<Omit<FormEntity, 'id' | 'createdBy'>>): Promise<FormEntity>;
  delete(id: string): Promise<void>;
}
