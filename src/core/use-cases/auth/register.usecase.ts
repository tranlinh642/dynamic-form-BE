import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IRegisterUseCase } from './register.usecase.interface';
import { IUSER_REPOSITORY_TOKEN } from 'src/core/repositories/user.repository.interface';
import type { IUserRepository } from 'src/core/repositories/user.repository.interface';
import { UserEntity } from 'src/core/entities/user.entity';
import { RegisterDto } from 'src/presentation/dtos/auth/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(registerDto: RegisterDto): Promise<UserEntity> {
    const existingUsername = await this.userRepository.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    const existingEmail = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const createdUser = await this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password_hash: passwordHash,
      is_active: true,
    });
    return new UserEntity(
      createdUser.id,
      createdUser.username,
      createdUser.email,
      createdUser.password_hash,
      createdUser.is_active,
    );
  }
}
