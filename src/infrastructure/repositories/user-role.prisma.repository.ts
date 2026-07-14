import { Injectable } from '@nestjs/common';
import { user_roles } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BasePrismaRepository } from './base.prisma.repository';
import { IUserRoleRepository } from '../../core/repositories/user-role.repository.interface';

@Injectable()
export class UserRolePrismaRepository
  extends BasePrismaRepository<user_roles>
  implements IUserRoleRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'user_roles');
  }
}
