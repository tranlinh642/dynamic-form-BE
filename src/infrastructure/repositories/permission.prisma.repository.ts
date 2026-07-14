import { Injectable } from '@nestjs/common';
import { permissions } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BasePrismaRepository } from './base.prisma.repository';
import { IPermissionRepository } from '../../core/repositories/permission.repository.interface';

@Injectable()
export class PermissionPrismaRepository extends BasePrismaRepository<permissions> implements IPermissionRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'permissions');
  }
}
