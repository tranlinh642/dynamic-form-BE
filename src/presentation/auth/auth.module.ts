import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../core/use-cases/auth/login.usecase';
import { ServerConfig } from '../../infrastructure/config/server.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterUseCase } from 'src/core/use-cases/auth/register.usecase';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serverConfig = new ServerConfig(configService);
        return {
          secret: serverConfig.authSecret,
          signOptions: {
            expiresIn: '60m',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, RegisterUseCase],
})
export class AuthModule {}
