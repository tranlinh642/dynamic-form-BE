import { Module } from '@nestjs/common';
import { PingController } from './ping.controller';
import { PingUseCase } from '../../core/use-cases/ping.usecase';
import { PingRepository } from '../../infrastructure/repositories/ping.repository';

@Module({
  controllers: [PingController],
  providers: [
    PingUseCase,
    {
      provide: 'IPingRepository',
      useClass: PingRepository,
    },
  ],
})
export class PingModule {}
