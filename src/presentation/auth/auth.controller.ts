import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUseCase } from '../../core/use-cases/auth/login.usecase';
import { LoginDto } from '../../core/dtos/login.dto';
import { SuccessResponse } from '../../shared/responses/success-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập và nhận JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Trả về Token' })
  login(@Body() loginDto: LoginDto) {
    const token = this.loginUseCase.execute(loginDto.username);
    return SuccessResponse.create({ accessToken: token });
  }
}
