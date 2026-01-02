import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Root endpoint - Redirects to API documentation' })
  @ApiResponse({ status: 302, description: 'Redirects to /api/docs' })
  @Redirect('/api/docs', 302)
  getRoot() {
    // Redirect to the docs page (absolute path) so when mounted at /api the redirect goes to /api/docs
    return { url: '/api/docs' };
  }

  @Get('docs')
  docs() {
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RevoBank API Docs</title>
    <!-- Ensure relative URLs resolve at the site root instead of under /api -->
    <base href="/" />
    <style>
      body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:0;color:#0f172a;background:#f8fafc}
      main{max-width:1200px;margin:3rem auto;padding:1rem}
      /* Minimal fallback styling if Redoc CSS fails to load */
      .fallback{background:#fff;border-radius:8px;padding:1rem;color:#111}
    </style>
  </head>
  <body>
    <main>
      <div class="fallback" id="fallback-message" style="display:none">
        <h1>API Documentation</h1>
        <p>Unable to load interactive docs. You can still fetch the raw OpenAPI spec at <a href="/api/openapi.json">/api/openapi.json</a>.</p>
      </div>

      <redoc spec-url="/api/openapi.json"></redoc>
      <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      <script>
        // Show fallback message if Redoc fails to initialize within 3s
        setTimeout(()=>{
          const redocEl = document.querySelector('redoc');
          if(!redocEl || !redocEl.shadowRoot || redocEl.shadowRoot.children.length===0){
            document.getElementById('fallback-message').style.display='block';
          }
        }, 3000);
      </script>
      <noscript>
        <div class="fallback">
          <h1>API Documentation (No JavaScript)</h1>
          <p>Enable JavaScript or fetch the OpenAPI JSON directly: <a href="/api/openapi.json">/api/openapi.json</a></p>
        </div>
      </noscript>
    </main>
  </body>
</html>`;

    return html;
  }

  @Get('openapi.json')
  openapi() {
    try {
      const { getOpenApiDocument } = require('./swagger.store');
      const doc = getOpenApiDocument();
      if (!doc) {
        return {
          status: 'error',
          message: 'OpenAPI document not ready',
        };
      }
      return doc;
    } catch (e) {
      return {
        status: 'error',
        message: 'OpenAPI document not available',
      };
    }
  }

  @Get('file-check')
  fileCheck() {
    const fs = require('fs');
    const path = require('path');
    const cwd = process.cwd();
    const checks = [];
    const candidates = [path.join(cwd, 'index.html'), path.join(cwd, 'public', 'index.html')];
    for (const p of candidates) {
      try {
        const stat = fs.statSync(p);
        const content = fs.readFileSync(p, { encoding: 'utf8' }).slice(0, 512);
        checks.push({ path: p, exists: true, size: stat.size, snippet: content });
      } catch (err: any) {
        checks.push({ path: p, exists: false, err: err?.code || String(err) });
      }
    }

    return {
      status: 'ok',
      cwd,
      files: checks,
    };
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

