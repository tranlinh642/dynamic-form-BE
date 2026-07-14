import { users } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
import { UserEntity } from '../entities/user.entity';

export const IUSER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository extends IBaseRepository<users> {
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  getPermissionsByUserId(userId: string): Promise<string[]>;
}
