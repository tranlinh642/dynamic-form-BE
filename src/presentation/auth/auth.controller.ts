import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUseCase } from '../../core/use-cases/auth/login.usecase';
import { LoginDto } from '../dtos/login.dto';
import { SuccessResponse } from '../../shared/responses/success-response';
import { RegisterUseCase } from 'src/core/use-cases/auth/register.usecase';
import { RegisterDto } from '../dtos/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập và nhận JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Trả về Token' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.loginUseCase.execute(loginDto);
    return SuccessResponse.create({ accessToken: token });
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Đăng kí thành công' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.registerUseCase.execute(registerDto);
    return SuccessResponse.create({
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    });
  }
}
