// Vercel Serverless Function wrapper for NestJS
// Note: Vercel uses serverless functions which may have cold start issues
// For better performance with persistent connections, consider Railway or Render

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express.default();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // Enable CORS
    app.enableCors();

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('RevoBank API')
      .setDescription('Secure and scalable banking API for RevoBank')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

