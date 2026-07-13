import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PingModule } from './presentation/ping/ping.module';
import { AuthModule } from './presentation/auth/auth.module';
import { ServerConfig } from './infrastructure/config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serverConfig = new ServerConfig(configService);

        if (!serverConfig.rateLimiterEnabled) {
          return [];
        }

        return [
          {
            ttl: serverConfig.rateLimiterResetTimeInMinutes * 60,
            limit: serverConfig.rateLimiterMaxRequests,
          },
        ];
      },
    }),

    PingModule,
    AuthModule,
  ],
})
export class AppModule {}
