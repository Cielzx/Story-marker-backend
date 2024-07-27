import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
    new ValidationPipe({
      transform: true,
      transformOptions: {
        groups: ['transform'],
      },
    }),
  );
  app.enableCors({
    origin: 'https://story-marker-backend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(3001);
  app.enableShutdownHooks();
}
bootstrap();
