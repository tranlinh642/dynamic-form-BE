import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BasePrismaRepository } from './base.prisma.repository';
import { IUserRepository } from '../../core/repositories/user.repository.interface';
import { UserEntity } from 'src/core/entities/user.entity';

@Injectable()
export class UserPrismaRepository
  extends BasePrismaRepository<users>
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'users');
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.users.findUnique({
      where: { username },
    });
    if (!prismaUser) return null;
    return new UserEntity(
      prismaUser.id,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password_hash,
      prismaUser.is_active,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (!prismaUser) return null;
    return new UserEntity(
      prismaUser.id,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password_hash,
      prismaUser.is_active,
    );
  }

  async getPermissionsByUserId(userId: string): Promise<string[]> {
    const permissions = await this.prisma.permissions.findMany({
      where: {
        role_permissions: {
          some: {
            roles: {
              user_roles: {
                some: {
                  user_id: userId,
                },
              },
            },
          },
        },
      },
      select: {
        action_code: true,
      },
    });

    return permissions.map((p) => p.action_code);
  }

  override async create(data: {
    username: string;
    email: string;
    password_hash: string;
    is_active?: boolean;
    roleName?: string;
  }): Promise<users> {
    const roleName = data.roleName || 'SW_EMPLOYEE';

    const role = await this.prisma.roles.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error(
        `Role '${roleName}' không tồn tại trong hệ thống. Hãy chạy seed dữ liệu trước.`,
      );
    }

    return this.prisma.users.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.password_hash,
        is_active: data.is_active ?? true,
        user_roles: {
          create: {
            role_id: role.id,
          },
        },
      },
    });
  }
}
