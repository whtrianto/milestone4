import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root endpoint - Redirects to API documentation' })
  @ApiResponse({ status: 302, description: 'Redirects to /api' })
  @Redirect('/api', 302)
  getRoot() {
    // Redirect ke Swagger documentation
    return { url: '/api' };
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
}

