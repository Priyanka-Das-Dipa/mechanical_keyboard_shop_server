/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://mechanical-keyboard-shop-client-theta.vercel.app',
    ],
    credentials: true,
  });

  app.use(cookieParser());

  app.use(helmet());

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 5000);
  // await app.listen(5000);
}
bootstrap();
