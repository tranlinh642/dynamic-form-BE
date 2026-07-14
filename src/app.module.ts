import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './presentation/auth/auth.module';
import { ServerConfig } from './infrastructure/config/server.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { FormModule } from './presentation/form/form.module';
import { FieldModule } from './presentation/field/field.module';
import { SubmissionModule } from './presentation/submission/submission.module';

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

    DatabaseModule,
    AuthModule,
    FormModule,
    FieldModule,
    SubmissionModule,
  ],
})
export class AppModule {}
