import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Root endpoint - Redirects to API documentation' })
  @ApiResponse({ status: 302, description: 'Redirects to /' })
  @Redirect('/', 302)
  getRoot() {
    // Redirect ke Swagger documentation (served at root inside the function)
    return { url: '/' };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      message: 'RevoBank API is running',
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
  }

  @Get('debug')
  debug() {
    const dbUrl = process.env.DATABASE_URL;
    let dbHost = '(missing)';
    let dbPort = '(unknown)';
    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        dbHost = parsed.hostname;
        dbPort = parsed.port || '5432';
      } catch (e) {
        dbHost = '(invalid DATABASE_URL)';
      }
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: {
        databaseUrlSet: !!dbUrl,
        databaseHost: dbHost,
        databasePort: dbPort,
        supabaseUrlSet: !!process.env.SUPABASE_URL,
        jwtSecretSet: !!process.env.JWT_SECRET,
      },
      prismaConnected: !!this.prisma?.isConnected,
    };
  }
}

