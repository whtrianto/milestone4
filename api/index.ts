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
    // Store the generated OpenAPI document so we can serve it directly if needed
    try {
      // avoid hard dependency if file not found in some contexts
      const { setOpenApiDocument } = await import('../src/swagger.store');
      setOpenApiDocument(document);
    } catch (e) {
      // noop
    }

    // Serve Swagger at the function root so on Vercel it becomes /api/
    SwaggerModule.setup('/', app, document);

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  try {
    const app = await bootstrap();
    const expressApp = app.getHttpAdapter().getInstance();

    // Vercel mounts functions under /api; strip that prefix so internal routes match
    // e.g. incoming /api -> '/' inside the express app, /api/users -> '/users'
    const originalUrl = req.url || '';
    if (originalUrl.startsWith('/api')) {
      req.url = originalUrl === '/api' ? '/' : originalUrl.slice(4);
      // Optional logging for debugging
      console.log(`Rewriting request URL from ${originalUrl} -> ${req.url}`);
    }

    return expressApp(req, res);
  } catch (err: any) {
    // Surface the error in logs and return a helpful response for debugging
    console.error('Serverless function initialization error:', err?.stack || err);
    res.status(500).json({
      statusCode: 500,
      message: 'Server initialization failed. Check server logs for details.',
      error: err?.message || String(err),
    });
  }
}

