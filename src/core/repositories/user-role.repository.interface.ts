import { user_roles } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export const IUSER_ROLE_REPOSITORY_TOKEN = Symbol('IUserRoleRepository');

export interface IUserRoleRepository extends IBaseRepository<user_roles> {}
