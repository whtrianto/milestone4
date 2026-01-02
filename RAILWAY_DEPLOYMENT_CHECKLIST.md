# Railway Deployment Checklist & Analysis

## ✅ Yang Sudah Benar

### 1. Package.json Scripts

- ✅ `build`: `nest build` - Sudah benar
- ✅ `start:prod`: `node dist/main` - Sudah benar
- ✅ `prisma:generate`: `prisma generate` - Sudah ada
- ✅ `prisma:migrate`: `prisma migrate dev` - Sudah ada
- ✅ `prisma:seed`: `ts-node prisma/seed.ts` - Sudah ada

### 2. Prisma Configuration

- ✅ `prisma/schema.prisma` menggunakan `env("DATABASE_URL")` - Sudah benar
- ✅ PrismaService extends PrismaClient - Sudah benar
- ✅ PrismaClient otomatis baca DATABASE_URL dari environment

### 3. NestJS Configuration

- ✅ ConfigModule sudah di-setup dengan `isGlobal: true` di `app.module.ts`
- ✅ JWT menggunakan ConfigService untuk baca JWT_SECRET
- ✅ Port menggunakan `process.env.PORT || 3000` - Sudah benar
- ✅ CORS sudah enabled di `main.ts`

### 4. Dependencies

- ✅ Semua dependencies yang diperlukan sudah ada
- ✅ `@nestjs/config` sudah terinstall
- ✅ `prisma` dan `@prisma/client` sudah terinstall

## ⚠️ Yang Perlu Diperhatikan

### 1. Build Command di Railway

**PENTING:** Pastikan build command di Railway include `prisma:generate`

**Build Command yang Benar:**

```bash
npm install && npm run build && npm run prisma:generate
```

**Alasan:**

- `npm install` - Install dependencies
- `npm run build` - Build TypeScript ke JavaScript
- `npm run prisma:generate` - Generate Prisma Client (WAJIB sebelum start)

### 2. Environment Variables di Railway

**Wajib di-set di Railway Dashboard (Backend Service):**

```bash
DATABASE_URL=${{POSTGRES_URL}}
JWT_SECRET=your-super-secret-jwt-key-minimal-32-characters
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
```

**Catatan:**

- `DATABASE_URL=${{MYSQL_URL}}` - Railway otomatis resolve ke connection string
- `JWT_SECRET` - Generate sendiri (minimal 32 karakter)
- `PORT` - Railway biasanya auto-set, tapi set manual lebih aman
- `NODE_ENV=production` - Untuk optimasi production

### 3. Start Command di Railway

**Start Command:**

```bash
npm run start:prod
```

**Atau:**

```bash
node dist/main
```

Kedua sama saja karena `start:prod` sudah set ke `node dist/main`.

### 4. Database Migrations

**PENTING:** Migrations HARUS dijalankan setelah deploy pertama!

**Cara 1: Railway Web Terminal**

1. Klik backend service di Railway
2. Tab "Deployments" → pilih deployment terbaru
3. Tab "Terminal"
4. Jalankan: `npm run prisma:migrate deploy`

**Cara 2: Railway CLI**

```bash
railway run npm run prisma:migrate deploy
```

## 🔧 Rekomendasi Perbaikan (Optional)

### 1. Tambahkan Health Check Endpoint

Sudah ada di `app.controller.ts` dengan endpoint `/health` - ✅ Sudah baik

### 2. Error Handling

Pastikan error handling sudah baik di semua service - ✅ Sudah ada

### 3. Logging

Pertimbangkan tambahkan logging untuk production (winston, pino, dll) - Optional

### 4. Railway Config File (Optional)

Bisa tambahkan `railway.json` untuk konfigurasi khusus, tapi tidak wajib karena Railway auto-detect.

## 📋 Checklist Sebelum Deploy

-- [ ] **Postgres Database** sudah dibuat di Railway (atau gunakan Supabase)

- [ ] **Backend Service** sudah di-deploy dari GitHub
- [ ] **Environment Variables** sudah di-set:
  - [ ] `DATABASE_URL=${{POSTGRES_URL}}`
  - [ ] `JWT_SECRET` (strong, minimal 32 chars)
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=production`
- [ ] **Build Command** sudah di-set: `npm install && npm run build && npm run prisma:generate`
- [ ] **Start Command** sudah di-set: `npm run start:prod`
- [ ] **Migrations** sudah dijalankan setelah deploy pertama
- [ ] **API** sudah di-test dan berfungsi

## 🚀 Langkah Deploy di Railway

1. **Create Postgres Database**

   - Railway Dashboard → New Project → Add Postgres (or create project on Supabase)

2. **Deploy Backend**

   - Railway Dashboard → New → GitHub Repo
   - Pilih repository: `milestone-4-whtrianto`

3. **Set Environment Variables**

   - Klik backend service → Tab "Variables"
   - Tambahkan semua environment variables

4. **Set Build & Start Commands**

   - Settings → Deploy
   - Build: `npm install && npm run build && npm run prisma:generate`
   - Start: `npm run start:prod`

5. **Run Migrations**

   - Terminal atau CLI: `npm run prisma:migrate deploy`

6. **Test API**
   - Buka URL Railway: `https://your-app.up.railway.app/api`
   - Test endpoints

## ✅ Kesimpulan

**Project ini SUDAH SIAP untuk deploy di Railway!**

Yang perlu dilakukan:

1. ✅ Pastikan build command include `prisma:generate`
2. ✅ Set environment variables di Railway dashboard
3. ✅ Run migrations setelah deploy
4. ✅ Test API

Tidak ada perubahan code yang diperlukan, hanya konfigurasi di Railway dashboard.
