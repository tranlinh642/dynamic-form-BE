import { role_permissions } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export const IROLE_PERMISSION_REPOSITORY_TOKEN = Symbol(
  'IRolePermissionRepository',
);

export interface IRolePermissionRepository extends IBaseRepository<role_permissions> {}
