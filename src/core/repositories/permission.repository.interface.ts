import { permissions } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export const IPERMISSION_REPOSITORY_TOKEN = Symbol('IPermissionRepository');

export interface IPermissionRepository extends IBaseRepository<permissions> {}
