import { roles } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export const IROLE_REPOSITORY_TOKEN = Symbol('IRoleRepository');

export interface IRoleRepository extends IBaseRepository<roles> {}
