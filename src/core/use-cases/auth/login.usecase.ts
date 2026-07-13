import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase {
  constructor(private jwtService: JwtService) {}

  execute(username: string): string {
    const payload = { sub: 1, username: username };

    return this.jwtService.sign(payload);
  }
}
