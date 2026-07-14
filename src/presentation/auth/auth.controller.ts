import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginUseCase } from '../../core/use-cases/auth/login.usecase';
import { LoginDto } from '../dtos/auth/login.dto';
import { SuccessResponse } from '../../shared/responses/success-response';
import { RegisterUseCase } from 'src/core/use-cases/auth/register.usecase';
import { RegisterDto } from '../dtos/auth/register.dto';
import { GetCurrentUserUseCase } from '../../core/use-cases/auth/get-current-user.usecase';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại kèm quyền' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin user và permissions',
  })
  async getMe(@Req() req: any) {
    const userId = req.user.sub;
    const profile = await this.getCurrentUserUseCase.execute(userId);
    return SuccessResponse.create(profile);
  }
}
