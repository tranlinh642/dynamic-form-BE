import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../../presentation/dtos/auth/login.dto';
import { ILoginUseCase } from './login.usecase.interface';
import { IUSER_REPOSITORY_TOKEN } from 'src/core/repositories/user.repository.interface';
import type { IUserRepository } from 'src/core/repositories/user.repository.interface';

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    private jwtService: JwtService,
    @Inject(IUSER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(loginDto: LoginDto): Promise<string> {
    const userEntity = await this.userRepository.findByUsername(
      loginDto.username,
    );
    if (!userEntity) {
      throw new UnauthorizedException(
        'Tên đăng nhập hoặc mật khẩu không chính xác',
      );
    }
    if (!userEntity.canLogin()) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const isPasswordValid = await userEntity.verifyPassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Tên đăng nhập hoặc mật khẩu không chính xác',
      );
    }

    const payload = { sub: userEntity.id, username: userEntity.username };

    return this.jwtService.sign(payload);
  }
}
