import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IUSER_REPOSITORY_TOKEN } from '../../core/repositories/user.repository.interface';
import { UserPrismaRepository } from '../repositories/user.prisma.repository';
import { IROLE_REPOSITORY_TOKEN } from '../../core/repositories/role.repository.interface';
import { RolePrismaRepository } from '../repositories/role.prisma.repository';
import { IPERMISSION_REPOSITORY_TOKEN } from '../../core/repositories/permission.repository.interface';
import { PermissionPrismaRepository } from '../repositories/permission.prisma.repository';
import { IUSER_ROLE_REPOSITORY_TOKEN } from '../../core/repositories/user-role.repository.interface';
import { UserRolePrismaRepository } from '../repositories/user-role.prisma.repository';
import { IROLE_PERMISSION_REPOSITORY_TOKEN } from '../../core/repositories/role-permission.repository.interface';
import { RolePermissionPrismaRepository } from '../repositories/role-permission.prisma.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: IUSER_REPOSITORY_TOKEN,
      useClass: UserPrismaRepository,
    },
    {
      provide: IROLE_REPOSITORY_TOKEN,
      useClass: RolePrismaRepository,
    },
    {
      provide: IPERMISSION_REPOSITORY_TOKEN,
      useClass: PermissionPrismaRepository,
    },
    {
      provide: IUSER_ROLE_REPOSITORY_TOKEN,
      useClass: UserRolePrismaRepository,
    },
    {
      provide: IROLE_PERMISSION_REPOSITORY_TOKEN,
      useClass: RolePermissionPrismaRepository,
    },
  ],
  exports: [
    PrismaService,
    IUSER_REPOSITORY_TOKEN,
    IROLE_REPOSITORY_TOKEN,
    IPERMISSION_REPOSITORY_TOKEN,
    IUSER_ROLE_REPOSITORY_TOKEN,
    IROLE_PERMISSION_REPOSITORY_TOKEN,
  ],
})
export class DatabaseModule {}
