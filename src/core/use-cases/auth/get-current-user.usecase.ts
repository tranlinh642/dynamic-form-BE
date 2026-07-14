import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGetCurrentUserUseCase, UserProfileResponse } from './get-current-user.usecase.interface';
import { IUSER_REPOSITORY_TOKEN } from '../../repositories/user.repository.interface';
import type { IUserRepository } from '../../repositories/user.repository.interface';

@Injectable()
export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserProfileResponse> {
    const rawUser = await this.userRepository.findById(userId);
    if (!rawUser) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    const permissions = await this.userRepository.getPermissionsByUserId(userId);

    return {
      id: rawUser.id,
      username: rawUser.username,
      email: rawUser.email,
      isActive: rawUser.is_active,
      permissions,
    };
  }
}
