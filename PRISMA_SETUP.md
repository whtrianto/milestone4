# Prisma 7 Configuration Guide

## Important Changes in Prisma 7.1.0

Prisma 7.1.0 introduced breaking changes to how database connection URLs are configured:

### Schema File (`prisma/schema.prisma`)

- **DO NOT** include `url` in the `datasource` block
- Only specify the `provider` (e.g., `mysql`, `postgresql`)

```prisma
datasource db {
  provider = "postgresql"
  // url is NOT allowed here in Prisma 7
}
```

### PrismaClient Initialization

The database URL must be passed when creating PrismaClient instances:

#### In Application Code (`src/prisma/prisma.service.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: configService.get<string>('DATABASE_URL'),
    },
  },
});
```

#### In Seed Scripts (`prisma/seed.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        'postgresql://postgres:password@railway-tcp-proxy-domain:5432/railway?schema=public&sslmode=require',
    },
  },
});
```

**Catatan untuk Railway / Supabase:**

- Di Railway/Supabase: `DATABASE_URL` akan otomatis di-set dari `${{POSTGRES_URL}}` (atau copy connection string dari Supabase)
- Untuk local development: Gunakan `POSTGRES_PUBLIC_URL` / connection string dari dashboard
- Format: `postgresql://postgres:password@host:5432/railway?schema=public&sslmode=require`

### Environment Variables

**Untuk Railway (Production):**
Set di platform dashboard (Railway/Supabase):

```env
DATABASE_URL=${{POSTGRES_URL}}
```

Platform akan otomatis resolve `${{POSTGRES_URL}}` menjadi connection string Postgres, contohnya:

```
postgresql://postgres:password@railway-private-domain:5432/railway?schema=public&sslmode=require
```

**Untuk Local Development:**
Make sure your `.env` file contains:

```env
DATABASE_URL="postgresql://postgres:password@monorail.proxy.rlwy.net:5432/railway?schema=public&sslmode=require"
```

**Catatan:** Copy `POSTGRES_PUBLIC_URL` dari Railway/Supabase dashboard (Postgres service → Variables)

### Running Commands

All Prisma commands work normally:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### Migration Files

Migration files are still created in `prisma/migrations/` and work the same way. The only difference is that the connection URL is read from environment variables or passed to PrismaClient, not from the schema file.

## Troubleshooting

### Error: "The datasource property `url` is no longer supported"

- Remove `url` from `prisma/schema.prisma`
- Ensure PrismaClient is initialized with the URL in the constructor

### Error: "Cannot find module '@prisma/client'"

- Run `npm run prisma:generate` first
- This generates the Prisma Client based on your schema

### Error: "Environment variable not found: DATABASE_URL"

- Create a `.env` file in the root directory
- Add `DATABASE_URL` with your database connection string

## References

- [Prisma 7 Migration Guide](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma Client Configuration](https://www.prisma.io/docs/orm/reference/api-reference/prisma-client-reference#prismaclient-constructor)
