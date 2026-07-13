import { Injectable, Inject } from '@nestjs/common';
import type { IPingRepository } from '../interfaces/ping.repository.interface';

@Injectable()
export class PingUseCase {
  constructor(
    @Inject('IPingRepository') private readonly pingRepo: IPingRepository
  ) {}

  execute(): string {
    const message = this.pingRepo.getPingMessage();
    return `${message} (Processed by Clean Architecture UseCase)`;
  }
}
