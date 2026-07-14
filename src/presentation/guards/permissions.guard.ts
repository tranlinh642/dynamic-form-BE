import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/require-permissions.decorator';
import { IUSER_REPOSITORY_TOKEN } from '../../core/repositories/user.repository.interface';
import type { IUserRepository } from '../../core/repositories/user.repository.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(IUSER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException(
        'Không tìm thấy danh tính người dùng hoặc chưa đăng nhập',
      );
    }

    const userPermissions = await this.userRepository.getPermissionsByUserId(
      user.sub,
    );

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập chức năng này');
    }

    return true;
  }
}
