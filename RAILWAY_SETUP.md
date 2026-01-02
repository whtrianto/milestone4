# Railway Setup Guide untuk RevoBank API

Panduan lengkap untuk setup project ini di Railway dengan database PostgreSQL (atau gunakan Supabase untuk hosting Postgres).

## 🚀 Quick Setup

### 1. Setup Database Postgres di Railway (atau gunakan Supabase)

1. Login ke [Railway Dashboard](https://railway.app)
2. Create New Project → Empty Project
3. Add Postgres Database:
   - Klik **"New"** → **"Database"** → **"Add Postgres"** (Railway) atau buat project di Supabase
   - Railway/Supabase akan otomatis create Postgres database
   - Tunggu beberapa detik sampai database siap

### 2. Environment Variables yang Disediakan Railway

Setelah Postgres service dibuat, platform akan generate environment variables berikut (contoh):

```
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=MBefPPJOHlGWBKsDfCHpFxXzyRYItbqE
POSTGRES_DB=${{POSTGRES_DB}}
POSTGRES_HOST=${{RAILWAY_PRIVATE_DOMAIN}}
POSTGRES_DATABASE=railway
POSTGRES_URL=postgresql://${{POSTGRES_USER}}:${{POSTGRES_PASSWORD}}@${{POSTGRES_HOST}}:5432/${{POSTGRES_DATABASE}}?schema=public&sslmode=require
POSTGRES_PUBLIC_URL=postgresql://${{POSTGRES_USER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{POSTGRES_DATABASE}}?schema=public&sslmode=require
```

**Catatan:**
-- `POSTGRES_PASSWORD` adalah password yang Anda berikan: `MBefPPJOHlGWBKsDfCHpFxXzyRYItbqE`
-- Platform akan menggunakan password ini untuk semua koneksi database
-- `POSTGRES_DATABASE=railway` adalah nama database default

**Catatan:**
-- `POSTGRES_PASSWORD=MBefPPJOHlGWBKsDfCHpFxXzyRYItbqE` - Password database Anda
-- `POSTGRES_USER=postgres` - Username database
-- `POSTGRES_PORT=5432` - Port Postgres
-- `POSTGRES_DATABASE=railway` - Nama database
-- `POSTGRES_URL` untuk koneksi internal (backend di Railway → database)
-- `POSTGRES_PUBLIC_URL` untuk koneksi eksternal (local machine → database)

### 3. Setup Backend di Railway

1. **Deploy dari GitHub:**

   - Di Railway project, klik **"New"** → **"GitHub Repo"**
   - Pilih repository: `milestone-4-whtrianto`
   - Railway akan otomatis detect Node.js project

2. **Configure Environment Variables:**

   Di backend service, set environment variables berikut:

   ```
   DATABASE_URL=${{POSTGRES_URL}}
   JWT_SECRET=your-super-secret-jwt-key-minimal-32-characters
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=production
   ```

   **Penting:**

   - `DATABASE_URL=${{POSTGRES_URL}}` - Platform akan otomatis resolve ke connection string lengkap
   - Platform otomatis share variables dari Postgres service, jadi `${{POSTGRES_URL}}` sudah tersedia
   - Generate `JWT_SECRET` yang kuat (minimal 32 karakter)

3. **Configure Build & Start Commands:**

   Di Settings → Deploy:

   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm run start:prod`

4. **Deploy:**
   - Railway akan otomatis deploy setelah configure
   - Tunggu build selesai (biasanya 2-5 menit)

### 4. Run Database Migrations

Setelah deploy selesai, jalankan migrations:

**Opsi 1: Menggunakan Railway Web Terminal (Recommended)**

1. Klik pada backend service
2. Klik tab **"Deployments"** → pilih deployment terbaru
3. Klik **"Terminal"** tab
4. Jalankan:
   ```bash
   npm run prisma:migrate deploy
   ```

**Opsi 2: Menggunakan Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link ke project
railway link

# Run migrations
railway run npm run prisma:migrate deploy
```

### 5. Seed Database (Optional)

```bash
# Di Railway terminal atau CLI
npm run prisma:seed
```

## 🔧 Development Local dengan Railway/Postgres Database

Jika ingin develop di local machine tapi menggunakan database Railway:

1. **Dapatkan POSTGRES_PUBLIC_URL:**

   - Di Railway dashboard, klik pada Postgres service
   - Pergi ke tab **"Variables"**
   - Copy value dari **`POSTGRES_PUBLIC_URL`**

2. **Setup .env di Local:**

   ```env
   DATABASE_URL="postgresql://postgres:MBefPPJOHlGWBKsDfCHpFxXzyRYItbqE@monorail.proxy.rlwy.net:5432/railway?schema=public&sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=development
   ```

   **Catatan:** Ganti dengan `MYSQL_PUBLIC_URL` yang sebenarnya dari Railway dashboard

3. **Run di Local:**
   ```bash
   npm install
   npm run prisma:generate
   npm run start:dev
   ```

## 📝 Environment Variables Reference

### Di Railway (Production)

| Variable         | Value               | Keterangan                 |
| ---------------- | ------------------- | -------------------------- |
| `DATABASE_URL`   | `${{POSTGRES_URL}}` | Auto-resolved oleh Railway |
| `JWT_SECRET`     | `your-secret-key`   | Generate sendiri           |
| `JWT_EXPIRES_IN` | `7d`                | Token expiration           |
| `PORT`           | `3000`              | Server port                |
| `NODE_ENV`       | `production`        | Environment                |

### Di Local (Development)

| Variable         | Value                 | Keterangan                  |
| ---------------- | --------------------- | --------------------------- |
| `DATABASE_URL`   | `POSTGRES_PUBLIC_URL` | Copy dari Railway dashboard |
| `JWT_SECRET`     | `your-secret-key`     | Generate sendiri            |
| `JWT_EXPIRES_IN` | `7d`                  | Token expiration            |
| `PORT`           | `3000`                | Server port                 |
| `NODE_ENV`       | `development`         | Environment                 |

## ✅ Checklist

- [ ] Postgres database sudah dibuat di Railway
- [ ] Backend service sudah di-deploy di Railway
- [ ] Environment variables sudah di-set:
  - [ ] `DATABASE_URL=${{MYSQL_URL}}`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `PORT`
  - [ ] `NODE_ENV`
- [ ] Build command sudah di-set: `npm install && npm run build && npm run prisma:generate`
- [ ] Start command sudah di-set: `npm run start:prod`
- [ ] Migrations sudah dijalankan
- [ ] API sudah di-test dan berfungsi

## 🔍 Troubleshooting

### Error: "Can't reach database server"

- Pastikan `DATABASE_URL=${{POSTGRES_URL}}` sudah di-set
- Pastikan Postgres service masih running di Railway/Supabase
- Cek Railway/Supabase logs untuk detail error

### Error: "Prisma Client not generated"

- Pastikan build command include: `npm run prisma:generate`
- Redeploy project

### Error: "Migration failed"

- Pastikan `DATABASE_URL` sudah benar
- Cek database connection di Railway/Supabase logs
- Pastikan migrations sudah dijalankan

## 📚 Referensi

- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)
