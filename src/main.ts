import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './infrastructure/config/server.config';
import { AllExceptionsFilter } from './presentation/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const serverConfig = new ServerConfig(configService);

  app.enableCors({
    origin: serverConfig.corsAllowedOrigins,
    credentials: serverConfig.corsCredentials,
    methods: serverConfig.corsMethods,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Dynamic Form API')
    .setDescription(
      'Tài liệu API cho hệ thống tạo Form động (NestJS Clean Architecture)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
