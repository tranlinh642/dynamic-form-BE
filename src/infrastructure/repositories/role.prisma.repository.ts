import { Injectable } from '@nestjs/common';
import { roles } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BasePrismaRepository } from './base.prisma.repository';
import { IRoleRepository } from '../../core/repositories/role.repository.interface';

@Injectable()
export class RolePrismaRepository extends BasePrismaRepository<roles> implements IRoleRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'roles');
  }
}
