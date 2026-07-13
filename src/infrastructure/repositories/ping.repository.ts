import { Injectable } from '@nestjs/common';
import { IPingRepository } from '../../core/interfaces/ping.repository.interface';

@Injectable()
export class PingRepository implements IPingRepository {
  getPingMessage(): string {
    return 'Pong from Database/Infrastructure Layer';
  }
}
