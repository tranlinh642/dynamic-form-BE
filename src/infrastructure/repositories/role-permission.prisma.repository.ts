import { Injectable } from '@nestjs/common';
import { role_permissions } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BasePrismaRepository } from './base.prisma.repository';
import { IRolePermissionRepository } from '../../core/repositories/role-permission.repository.interface';

@Injectable()
export class RolePermissionPrismaRepository
  extends BasePrismaRepository<role_permissions>
  implements IRolePermissionRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'role_permissions');
  }
}
