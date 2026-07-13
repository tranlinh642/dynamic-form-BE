import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PingUseCase } from '../../core/use-cases/ping.usecase';
import { SuccessResponse } from '../../shared/responses/success-response';

@ApiTags('Ping')
@Controller('ping')
export class PingController {
  constructor(private readonly pingUseCase: PingUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Kiểm tra hệ thống (Ping)' })
  @ApiResponse({ status: 200, description: 'Trả về thông điệp Ping' })
  getPing() {
    const message = this.pingUseCase.execute();
    return SuccessResponse.create(message);
  }
}
