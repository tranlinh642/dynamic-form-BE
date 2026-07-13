import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfig {
  constructor(private configService: ConfigService) {}

  // --- Auth ---
  get authSecret(): string {
    return this.configService.get<string>('AUTH_SECRET') || 'default_secret';
  }

  get authIgnoreExpiration(): boolean {
    return this.configService.get<string>('AUTH_IGNORE_EXPIRATION') === 'true';
  }

  // --- CORS ---
  get corsAllowedOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ALLOWED_ORIGINS');
    return origins ? origins.split(',') : ['*'];
  }

  get corsCredentials(): boolean {
    return this.configService.get<string>('CORS_CREDENTIALS') === 'true';
  }

  get corsMethods(): string {
    return this.configService.get<string>('CORS_METHODS') || 'GET,POST,PUT,DELETE,PATCH,OPTIONS';
  }

  // --- Rate Limiting ---
  get rateLimiterEnabled(): boolean {
    return this.configService.get<string>('RATELIMITER') === 'true';
  }

  get rateLimiterResetTimeInMinutes(): number {
    // Note: Throttler expects milliseconds in NestJS v6, or seconds in some versions.
    // The env has a typo "1C", let's parse gracefully
    const val = this.configService.get<string>('RATELIMITER_RESET_TIMEMS_IN_MINUTES') || '1';
    const parsed = parseInt(val.replace(/\D/g, ''), 10) || 1;
    return parsed;
  }

  get rateLimiterMaxRequests(): number {
    return parseInt(this.configService.get<string>('RATELIMITER_MAX_REQUESTS') || '10', 10);
  }
}
