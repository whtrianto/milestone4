import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public isConnected = false;

  async onModuleInit() {
    const dbUrl = process.env.DATABASE_URL;
    let host = '(missing)';
    let port = '(unknown)';

    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        host = parsed.hostname;
        port = parsed.port || '5432';
      } catch (e) {
        host = '(invalid DATABASE_URL)';
      }
    }

    try {
      await this.$connect();
      this.isConnected = true;
      console.log(`Prisma connected to ${host}:${port}`);
    } catch (err: any) {
      console.error(`Prisma failed to connect to database at ${host}:${port}:`, err?.message || err);
      // Keep the process running so the server can start and return a helpful error to callers.
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}

