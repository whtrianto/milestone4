# Deployment Guide

This guide will help you deploy the RevoBank API to various platforms.

## 🚀 Quick Start - Recommended Options

### 🏆 BEST CHOICE: Railway (Backend + Database) - MUDAH & GRATIS
✅ **PALING MUDAH DAN GRATIS untuk project ini!**
- 🆓 **Free tier**: $5 credit per bulan (cukup untuk project kecil)
- ⚡ **Setup super mudah**: Connect GitHub → Auto-detect → Deploy (5 menit!)
- 🎯 **All-in-one**: Backend + Database dalam satu project
- 🛠️ **Built-in terminal**: Run migrations langsung dari dashboard
- 📊 **Auto-scaling**: Otomatis scale sesuai kebutuhan
- **Lihat: Option 2 di bagian Backend Deployment**

**Kenapa Railway paling mudah?**
1. Tidak perlu setup database terpisah
2. Auto-generate `DATABASE_URL` 
3. Auto-detect Node.js dan build commands
4. Built-in web terminal untuk migrations
5. Satu dashboard untuk semua

### Alternative Options

#### Option 2: Render (Backend + Database terpisah)
- 🆓 Free tier tersedia (tapi sleep setelah 15 menit tidak aktif)
- ⚙️ Setup sedikit lebih kompleks
- **Lihat: Option 1 di bagian Backend Deployment**

#### Option 3: Vercel (Backend) + Hostinger (Database) ⭐
✅ **Cocok jika sudah punya hosting Hostinger!**
- 🆓 **Vercel**: Free tier untuk backend (serverless)
- 💰 **Hostinger**: Pakai database yang sudah ada
- 📝 **Panduan Lengkap**: Lihat Option 3 di bagian Backend Deployment
- ⚠️ **Catatan**: Vercel serverless (cold start 1-3 detik, timeout 10s/60s)

#### Option 4: Fly.io
- 🆓 Free tier tersedia
- ⚙️ Perlu setup via CLI
- **Lihat: Option 4 di bagian Backend Deployment**


## Prerequisites

- A MySQL database (local or cloud)
- Git repository with your code
- Environment variables configured

## Database Setup

### Option 1: TigerData

1. Sign up at [TigerData](https://tigerdata.com)
2. Create a new MySQL database instance
3. Copy the connection string
4. Update your `DATABASE_URL` environment variable:
   ```
   DATABASE_URL="mysql://username:password@host:port/database"
   ```

### Option 2: Supabase

1. Create a project at [Supabase](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Update your `DATABASE_URL` environment variable

### Option 3: Railway (Recommended for Cloud)

1. **Create Account**
   - Sign up at [Railway](https://railway.app)
   - Connect your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Empty Project"

3. **Add MySQL Service**
   - Click "New" > "Database" > "Add MySQL"
   - Railway will automatically create a MySQL database
   - Copy the `DATABASE_URL` from the MySQL service variables tab

4. **Get Connection String**
   - Format: `mysql://user:password@host:port/database`
   - Railway automatically provides this in the service variables

**Keuntungan Railway:**
- ✅ Free tier yang generous
- ✅ Auto-scaling
- ✅ Easy connection dengan backend di Railway
- ✅ Built-in monitoring

### Option 4: Hostinger MySQL Database

✅ **Cocok jika Anda sudah punya hosting di Hostinger!**

Hostinger menyediakan MySQL database yang bisa digunakan untuk project ini. Berikut langkah-langkahnya:

1. **Login ke hPanel Hostinger**
   - Login ke [hPanel Hostinger](https://hpanel.hostinger.com)
   - Atau akses melalui domain Anda: `https://yourdomain.com/hpanel`

2. **Buat Database MySQL**
   - Di hPanel, cari section **"Databases"** atau **"MySQL Databases"**
   - Klik **"Create Database"** atau **"Add New Database"**
   - Isi informasi:
     - **Database Name**: `revobank` (atau nama lain yang Anda inginkan)
     - **Database User**: Buat user baru atau gunakan user yang sudah ada
     - **Password**: Buat password yang kuat (simpan dengan aman!)
   - Klik **"Create"** atau **"Add"**

3. **Dapatkan Connection Details**
   Setelah database dibuat, catat informasi berikut:
   - **Database Host**: Biasanya `mysql.hostinger.com` atau `mysql.yourdomain.com`
     - Atau format: `mysqlXX.hostinger.com` (XX adalah nomor server)
     - **Catatan**: Bisa juga `localhost` jika backend di-host di Hostinger yang sama
   - **Database Port**: `3306` (default MySQL)
   - **Database Name**: Nama database yang Anda buat (contoh: `u123456789_revobank`)
   - **Database User**: Username yang Anda buat (contoh: `u123456789_dbuser`)
   - **Database Password**: Password yang Anda set

4. **Buat Connection String**
   Format connection string untuk Hostinger:
   ```
   DATABASE_URL="mysql://username:password@host:port/database"
   ```
   
   **Contoh:**
   ```
   DATABASE_URL="mysql://u123456789_dbuser:YourPassword123@mysql.hostinger.com:3306/u123456789_revobank"
   ```
   
   **Catatan Penting:**
   - Ganti `username`, `password`, `host`, dan `database` dengan nilai yang sesuai
   - Jika ada karakter khusus di password (seperti `@`, `#`, `%`), perlu di-encode URL:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`
     - `&` → `%26`
   - Contoh password dengan karakter khusus:
     ```
     Password: MyP@ss#123
     Encoded: MyP%40ss%23123
     DATABASE_URL="mysql://user:MyP%40ss%23123@host:3306/database"
     ```

5. **Test Connection (Optional)**
   - Anda bisa test connection menggunakan MySQL client atau phpMyAdmin
   - Di hPanel, biasanya ada **phpMyAdmin** untuk manage database

6. **Gunakan di Backend**
   - Set `DATABASE_URL` di environment variables platform deployment Anda
   - Atau di file `.env` untuk development:
     ```env
     DATABASE_URL="mysql://u123456789_dbuser:YourPassword123@mysql.hostinger.com:3306/u123456789_revobank"
     JWT_SECRET="your-super-secret-jwt-key"
     JWT_EXPIRES_IN="7d"
     PORT=3000
     ```

**⚠️ Catatan Penting untuk Hostinger:**
- ✅ **Remote Access**: Pastikan database bisa diakses dari luar (remote access enabled)
  - Di hPanel, cek setting **"Remote MySQL"** atau **"Allow Remote Access"**
  - Tambahkan IP address backend server Anda (atau `%` untuk allow semua IP)
- ✅ **Firewall**: Pastikan port 3306 tidak di-block
- ✅ **Connection Limit**: Hostinger biasanya punya limit koneksi (cek paket Anda)
- ✅ **Backend Location**: 
  - Jika backend di-deploy di **Hostinger juga** → gunakan `localhost` sebagai host
  - Jika backend di-deploy di **platform lain** (Railway, Vercel, dll) → gunakan host remote (mysql.hostinger.com)

**🔐 URL Encoding untuk Password dengan Karakter Khusus:**

Jika password database Anda mengandung karakter khusus, perlu di-URL encode. Berikut tabel encoding:

| Karakter | Encoded | Contoh |
|----------|---------|--------|
| `@` | `%40` | `pass@123` → `pass%40123` |
| `#` | `%23` | `pass#123` → `pass%23123` |
| `%` | `%25` | `pass%123` → `pass%25123` |
| `&` | `%26` | `pass&123` → `pass%26123` |
| `+` | `%2B` | `pass+123` → `pass%2B123` |
| `=` | `%3D` | `pass=123` → `pass%3D123` |
| `!` | `%21` | `pass!123` → `pass%21123` |
| `$` | `%24` | `pass$123` → `pass%24123` |
| `*` | `%2A` | `pass*123` → `pass%2A123` |
| `(` | `%28` | `pass(123` → `pass%28123` |
| `)` | `%29` | `pass)123` → `pass%29123` |
| ` ` (spasi) | `%20` atau `+` | `pass 123` → `pass%20123` |

**Cara Encode Password:**
1. **Online Tool**: https://www.urlencoder.org/ atau https://www.url-encode-decode.com/
2. **Manual**: Ganti setiap karakter khusus dengan encoded value
3. **Contoh Lengkap**:
   - Password asli: `MyP@ss#123!`
   - Encoded: `MyP%40ss%23123%21`
   - Full DATABASE_URL: `mysql://user:MyP%40ss%23123%21@mysql.hostinger.com:3306/database`

**Kombinasi Deployment yang Cocok:**
- ✅ **Backend di Railway/Vercel/Render + Database di Hostinger** → Perfect!
- ✅ **Backend di Hostinger + Database di Hostinger** → Juga bisa (pakai `localhost`)

### Option 5: Local MySQL

1. Install MySQL on your server
2. Create a database:
   ```sql
   CREATE DATABASE revobank;
   ```
3. Update your `DATABASE_URL`:
   ```
   DATABASE_URL="mysql://root:password@localhost:3306/revobank"
   ```

## Backend Deployment

### Option 1: Render

1. **Create Account**
   - Sign up at [Render](https://render.com)
   - Connect your GitHub account

2. **Create Web Service**
   - Click "New" > "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: revobank-api
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build && npm run prisma:generate`
     - **Start Command**: `npm run start:prod`

3. **Environment Variables**
   Add these in the Render dashboard:
   ```
   DATABASE_URL=your-database-url
   ```
   **Catatan**: 
   - Jika menggunakan **Railway Database**: Copy `DATABASE_URL` dari Railway
   - Jika menggunakan **Hostinger Database**: Format `mysql://user:password@mysql.hostinger.com:3306/database`
   - Jika menggunakan **database lain**: Sesuaikan dengan connection string yang diberikan
   
   Variable lainnya:
   ```
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   PORT=10000
   NODE_ENV=production
   ```

4. **Database Migrations**
   After deployment, run migrations:
   ```bash
   npm run prisma:migrate deploy
   ```

5. **Seed Database** (Optional)
   ```bash
   npm run prisma:seed
   ```

### Option 2: Railway ⭐ MUDAH & GRATIS - RECOMMENDED!

**⏱️ Total waktu setup: ~5-10 menit**

1. **Create Account** (1 menit)
   - Sign up at [Railway](https://railway.app) (bisa pakai GitHub login)
   - Connect your GitHub account
   - **Free tier**: $5 credit per bulan (cukup untuk project kecil)

2. **Create New Project** (1 menit)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `milestone-4-whtrianto`
   - Railway akan otomatis detect ini adalah Node.js project

3. **Add MySQL Database** (1 menit)
   - Di project dashboard, click "New" > "Database" > "Add MySQL"
   - Railway akan otomatis create MySQL database
   - **Bonus**: Railway otomatis generate `DATABASE_URL` dan connect ke backend!

4. **Configure Environment Variables** (2 menit)
   - **Jika menggunakan Railway Database**: Railway sudah auto-generate `DATABASE_URL`
   - **Jika menggunakan Hostinger Database**: Tambahkan `DATABASE_URL` dari Hostinger
     ```
     DATABASE_URL=mysql://user:password@mysql.hostinger.com:3306/database
     ```
   - Tambahkan variable lainnya di Settings > Variables:
   ```
   JWT_SECRET=your-super-secret-jwt-key-minimal-32-karakter
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=production
   ```
   - **Tips**: Generate JWT_SECRET di https://randomkeygen.com/ atau pakai:
     ```bash
     openssl rand -base64 32
     ```

5. **Configure Build & Start** (1 menit)
   - Railway sudah auto-detect build commands
   - Tapi pastikan di Settings > Deploy:
     - **Build Command**: `npm install && npm run build && npm run prisma:generate`
     - **Start Command**: `npm run start:prod`
   - Railway akan otomatis deploy!

6. **Run Migrations** (2 menit)
   - Setelah deploy selesai, buka **Railway web terminal**:
     - Klik pada service backend
     - Klik tab "Deployments" > pilih deployment terbaru
     - Klik "View Logs" atau gunakan "Terminal" tab
   - Atau gunakan Railway CLI:
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

7. **Seed Database (Optional)**
   ```bash
   railway run npm run prisma:seed
   ```

**✅ Selesai!** API Anda sudah live di URL yang diberikan Railway (format: `https://your-app-name.up.railway.app`)

**🎁 Bonus Railway:**
- ✅ Auto HTTPS/SSL
- ✅ Custom domain support (gratis)
- ✅ Built-in monitoring & logs
- ✅ Auto-restart jika crash
- ✅ Easy rollback jika ada masalah

### Option 3: Vercel (Backend) + Hostinger (Database) ⭐ SPESIFIK

**📋 Panduan Lengkap Step-by-Step untuk Vercel + Hostinger**

**⏱️ Total waktu setup: ~15-20 menit**

---

## 🗄️ BAGIAN 1: Setup Database di Hostinger

### Langkah 1: Login ke hPanel Hostinger

1. Buka browser dan kunjungi: **https://hpanel.hostinger.com**
2. Login dengan akun Hostinger Anda
3. Setelah login, Anda akan melihat dashboard hPanel

### Langkah 2: Buat Database MySQL

1. Di hPanel, scroll ke bawah atau cari menu **"Databases"** atau **"MySQL Databases"**
2. Klik **"MySQL Databases"** atau **"Create Database"**
3. Anda akan melihat form untuk membuat database baru:
   - **Database Name**: Masukkan nama database, contoh: `revobank` atau `u123456789_revobank`
     - Catatan: Hostinger biasanya menambahkan prefix `u123456789_` (nomor user Anda)
   - **Database User**: 
     - Pilih **"Create New User"** atau gunakan user yang sudah ada
     - Jika create new: Masukkan username (contoh: `dbuser` atau `revobank_user`)
   - **Password**: 
     - Buat password yang kuat (minimal 12 karakter)
     - **PENTING**: Simpan password ini dengan aman! Anda akan membutuhkannya nanti
     - Contoh password: `MySecurePass123!@#`
4. Klik **"Create"** atau **"Add Database"**
5. Tunggu beberapa detik sampai database berhasil dibuat

### Langkah 3: Catat Informasi Database

Setelah database dibuat, catat informasi berikut (Anda akan membutuhkannya nanti):

1. **Database Host**:
   - Biasanya: `mysql.hostinger.com` atau `mysql.yourdomain.com`
   - Atau format: `mysqlXX.hostinger.com` (XX adalah nomor server)
   - **Cara cek**: Di hPanel, lihat di bagian "Current Databases" atau "Database Details"
   - **Contoh**: `mysql.hostinger.com` atau `mysql123.hostinger.com`

2. **Database Port**: `3306` (default MySQL)

3. **Database Name**: Nama database yang Anda buat
   - **Contoh**: `u123456789_revobank`

4. **Database User**: Username yang Anda buat
   - **Contoh**: `u123456789_dbuser`

5. **Database Password**: Password yang Anda set
   - **Contoh**: `MySecurePass123!@#`

### Langkah 4: Enable Remote Access (PENTING!)

**⚠️ WAJIB dilakukan jika backend di-deploy di Vercel (bukan di Hostinger)**

1. Di hPanel, cari menu **"Remote MySQL"** atau **"Remote Database Access"**
2. Klik **"Remote MySQL"** atau **"Add Access Host"**
3. Tambahkan IP address yang diizinkan:
   - **Opsi 1**: Tambahkan `%` (allow semua IP) - **Lebih mudah tapi kurang secure**
   - **Opsi 2**: Tambahkan IP Vercel (lebih secure, tapi IP Vercel bisa berubah)
   - **Rekomendasi untuk testing**: Gunakan `%` dulu
4. Klik **"Add Host"** atau **"Save"**
5. Tunggu beberapa menit sampai setting aktif

**Catatan**: Jika tidak enable remote access, Vercel tidak bisa connect ke database Hostinger!

---

## 🚀 BAGIAN 2: Setup Backend di Vercel

### Langkah 1: Buat Akun Vercel (Jika Belum Punya)

1. Buka browser dan kunjungi: **https://vercel.com**
2. Klik **"Sign Up"** di pojok kanan atas
3. Pilih **"Continue with GitHub"** (disarankan, karena project Anda di GitHub)
4. Authorize Vercel untuk mengakses GitHub Anda
5. Setelah login, Anda akan masuk ke dashboard Vercel

### Langkah 2: Import Project dari GitHub

1. Di dashboard Vercel, klik tombol **"Add New..."** di pojok kanan atas
2. Pilih **"Project"** dari dropdown
3. Anda akan melihat daftar repository GitHub Anda
4. Cari dan klik repository: **`milestone-4-whtrianto`**
   - Jika tidak muncul, klik **"Adjust GitHub App Permissions"** dan berikan akses ke repository
5. Klik **"Import"** pada repository yang dipilih

### Langkah 3: Configure Project Settings

Setelah import, Anda akan melihat halaman **"Configure Project"**. Isi dengan detail berikut:

1. **Project Name**: 
   - Biarkan default atau ubah menjadi: `revobank-api` atau `milestone-4-api`
   - Klik **"Edit"** jika ingin mengubah

2. **Framework Preset**: 
   - Pilih **"Other"** dari dropdown
   - (Vercel akan otomatis detect, tapi pastikan "Other")

3. **Root Directory**: 
   - Biarkan kosong atau isi dengan: `./`
   - (Ini berarti root folder project)

4. **Build and Output Settings**:
   - Klik **"Override"** untuk mengatur manual
   - **Build Command**: 
     ```
     npm install && npm run build && npm run prisma:generate
     ```
   - **Output Directory**: 
     ```
     dist
     ```
   - **Install Command**: 
     ```
     npm install
     ```

5. **Environment Variables**: 
   - **JANGAN diisi dulu!** Kita akan set ini di langkah berikutnya
   - Klik **"Skip"** atau biarkan kosong untuk sekarang

6. Klik **"Deploy"** (kita akan set environment variables setelah ini)

### Langkah 4: Set Environment Variables

**⚠️ PENTING: Set environment variables SEBELUM atau SETELAH deploy pertama**

#### Cara 1: Set Sebelum Deploy (Recommended)

1. Di halaman "Configure Project", sebelum klik "Deploy":
   - Scroll ke bagian **"Environment Variables"**
   - Klik **"Add"** atau **"Add New"**

2. Tambahkan variable berikut satu per satu:

   **Variable 1: DATABASE_URL**
   - **Key**: `DATABASE_URL`
   - **Value**: Buat connection string dengan format:
     ```
     mysql://username:password@host:port/database
     ```
   - **Contoh konkret**:
     ```
     mysql://u123456789_dbuser:MySecurePass123!@#@mysql.hostinger.com:3306/u123456789_revobank
     ```
   - **⚠️ PENTING**: Jika password ada karakter khusus, perlu URL encode:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `=` → `%3D`
     - `!` → `%21`
   - **Contoh password dengan encoding**:
     - Password: `MyPass@123#`
     - Encoded: `MyPass%40123%23`
     - Full URL: `mysql://user:MyPass%40123%23@mysql.hostinger.com:3306/database`
   - **Environment**: Pilih semua (Production, Preview, Development)
   - Klik **"Save"**

   **Variable 2: JWT_SECRET**
   - **Key**: `JWT_SECRET`
   - **Value**: Generate secret key yang kuat (minimal 32 karakter)
     - **Cara generate**:
       - Online: https://randomkeygen.com/ (pilih "CodeIgniter Encryption Keys")
       - Atau terminal: `openssl rand -base64 32`
     - **Contoh**: `aB3xY9mK2pL8nQ5rT7vW1zC4dF6gH0jM9kL2pN8qR5sT1uV4wX7yZ0`
   - **Environment**: Pilih semua
   - Klik **"Save"**

   **Variable 3: JWT_EXPIRES_IN**
   - **Key**: `JWT_EXPIRES_IN`
   - **Value**: `7d`
   - **Environment**: Pilih semua
   - Klik **"Save"**

   **Variable 4: PORT**
   - **Key**: `PORT`
   - **Value**: `3000`
   - **Environment**: Pilih semua
   - Klik **"Save"**

   **Variable 5: NODE_ENV**
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: Pilih semua
   - Klik **"Save"**

#### Cara 2: Set Setelah Deploy

1. Setelah deploy pertama (akan gagal karena belum ada env vars), klik pada project di dashboard
2. Klik tab **"Settings"** (di bagian atas)
3. Klik **"Environment Variables"** (di menu sebelah kiri)
4. Tambahkan semua variable seperti di atas
5. Setelah semua variable ditambahkan, klik **"Redeploy"** di tab **"Deployments"**

### Langkah 5: Deploy Project

1. Setelah semua environment variables di-set, klik **"Deploy"**
2. Vercel akan mulai build project Anda
3. Tunggu proses build selesai (biasanya 2-5 menit)
4. Anda bisa melihat progress di halaman deployment
5. Setelah selesai, Anda akan mendapat URL seperti: `https://your-project-name.vercel.app`

### Langkah 6: Run Database Migrations

**⚠️ PENTING: Migrations HARUS dijalankan sebelum API bisa digunakan!**

Karena Vercel tidak memiliki persistent shell, migrations harus dijalankan dari local machine:

1. **Buka terminal di komputer lokal Anda**

2. **Clone atau pastikan project sudah di local**:
   ```bash
   cd D:\xampp\htdocs\mileston4
   ```

3. **Set Environment Variable DATABASE_URL**:
   
   **Windows PowerShell**:
   ```powershell
   $env:DATABASE_URL="mysql://username:password@mysql.hostinger.com:3306/database"
   ```
   
   **Windows CMD**:
   ```cmd
   set DATABASE_URL=mysql://username:password@mysql.hostinger.com:3306/database
   ```
   
   **Linux/Mac**:
   ```bash
   export DATABASE_URL="mysql://username:password@mysql.hostinger.com:3306/database"
   ```
   
   **⚠️ Ganti dengan data Hostinger Anda!**
   - Contoh:
     ```powershell
     $env:DATABASE_URL="mysql://u123456789_dbuser:MySecurePass123!@#@mysql.hostinger.com:3306/u123456789_revobank"
     ```
   - Jika password ada karakter khusus, gunakan URL encoding

4. **Install dependencies** (jika belum):
   ```bash
   npm install
   ```

5. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

6. **Run Migrations**:
   ```bash
   npm run prisma:migrate deploy
   ```
   
   Output yang diharapkan:
   ```
   Environment variables loaded from .env
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": MySQL database "u123456789_revobank"
   
   Applying migration `20240101000000_init`
   ...
   
   The following migration(s) have been applied:
   - 20240101000000_init
   ```

7. **(Optional) Seed Database** dengan data sample:
   ```bash
   npm run prisma:seed
   ```

### Langkah 7: Verify Deployment

1. **Cek API Health**:
   - Buka browser, kunjungi: `https://your-project-name.vercel.app/api`
   - Anda harus melihat Swagger UI documentation

2. **Test Endpoint**:
   - Coba register user: `POST https://your-project-name.vercel.app/auth/register`
   - Body:
     ```json
     {
       "email": "test@example.com",
       "name": "Test User",
       "password": "Test123!"
     }
     ```

3. **Cek Logs** (jika ada error):
   - Di Vercel dashboard, klik tab **"Deployments"**
   - Klik pada deployment terbaru
   - Klik **"View Function Logs"** untuk melihat error logs

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"

**Penyebab**: Remote access belum di-enable di Hostinger

**Solusi**:
1. Login ke hPanel Hostinger
2. Enable "Remote MySQL" access
3. Tambahkan `%` sebagai allowed host
4. Tunggu 5-10 menit
5. Redeploy di Vercel

### Error: "Access denied for user"

**Penyebab**: Username/password salah atau user tidak punya permission

**Solusi**:
1. Double-check username dan password di hPanel
2. Pastikan user memiliki permission untuk database tersebut
3. Coba test connection dengan MySQL client dulu

### Error: "Connection timeout"

**Penyebab**: Firewall block atau host salah

**Solusi**:
1. Pastikan host benar (cek di hPanel)
2. Pastikan port 3306 tidak di-block
3. Coba test dari local machine dulu

### Error: "Password contains special characters"

**Penyebab**: Password ada karakter khusus yang perlu URL encode

**Solusi**:
1. Encode password dengan URL encoding
2. Gunakan tool online: https://www.urlencoder.org/
3. Atau encode manual:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`

### Error Build: "Cannot find module"

**Penyebab**: Dependencies tidak terinstall atau build command salah

**Solusi**:
1. Pastikan build command: `npm install && npm run build && npm run prisma:generate`
2. Cek `package.json` ada semua dependencies
3. Lihat build logs di Vercel untuk detail error

### Error Runtime: "Prisma Client not generated"

**Penyebab**: `prisma:generate` tidak dijalankan saat build

**Solusi**:
1. Pastikan build command include: `npm run prisma:generate`
2. Redeploy project

---

## ✅ Checklist Deployment

Sebelum deploy, pastikan:

- [ ] Database MySQL sudah dibuat di Hostinger
- [ ] Remote MySQL access sudah di-enable di Hostinger
- [ ] Sudah catat: host, username, password, database name
- [ ] Password sudah di-URL encode jika ada karakter khusus
- [ ] Project sudah di-import ke Vercel
- [ ] Build command sudah di-set: `npm install && npm run build && npm run prisma:generate`
- [ ] Semua environment variables sudah di-set di Vercel:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `PORT`
  - [ ] `NODE_ENV`
- [ ] Migrations sudah dijalankan dari local machine
- [ ] API sudah di-test dan berfungsi

---

## 📝 Catatan Penting

1. **Vercel menggunakan serverless functions**:
   - Cold start: 1-3 detik pada request pertama
   - Timeout: 10 detik (Hobby), 60 detik (Pro)
   - Tidak ideal untuk long-running operations

2. **Database Hostinger**:
   - Pastikan remote access enabled
   - Monitor connection limit (tergantung paket)
   - Backup database secara berkala

3. **Security**:
   - Jangan commit `.env` file ke GitHub
   - Gunakan strong JWT_SECRET
   - Enable HTTPS (otomatis di Vercel)

4. **Migrations**:
   - Harus dijalankan manual dari local machine
   - Atau buat migration endpoint (untuk development only)

---

**🎉 Selamat! API Anda sudah live di Vercel dengan database Hostinger!**

### Option 4: Fly.io

1. **Install Fly CLI**
   ```bash
   npm install -g @fly/cli
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Initialize**
   ```bash
   fly launch
   ```
   Follow the prompts to create your app.

4. **Set Secrets**
   ```bash
   fly secrets set DATABASE_URL="your-database-url"
   fly secrets set JWT_SECRET="your-secret-key"
   fly secrets set JWT_EXPIRES_IN="7d"
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Run Migrations**
   ```bash
   fly ssh console
   npm run prisma:migrate deploy
   ```

## Post-Deployment Steps

1. **Run Database Migrations**
   ```bash
   npm run prisma:migrate deploy
   ```

2. **Seed Database** (Optional)
   ```bash
   npm run prisma:seed
   ```

3. **Verify Deployment**
   - Check API health: `GET https://your-api-url/api`
   - Test authentication: `POST https://your-api-url/auth/login`
   - Access Swagger: `https://your-api-url/api`

## Environment Variables Checklist

Make sure these are set in your deployment platform:

- ✅ `DATABASE_URL` - MySQL connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens (use a strong random string)
- ✅ `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- ✅ `PORT` - Server port (usually auto-set by platform)
- ✅ `NODE_ENV` - Set to "production"

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database firewall settings
- Ensure database is accessible from your deployment platform

### Migration Errors
- Run `npm run prisma:generate` before migrations
- Check Prisma schema syntax
- Verify database permissions

### Build Errors
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs for specific errors

### Runtime Errors
- Check environment variables are set correctly
- Verify database is running and accessible
- Review application logs

## Monitoring

After deployment, monitor:
- API response times
- Error rates
- Database connection pool
- Memory usage

## Security Checklist

- ✅ Use strong `JWT_SECRET` (at least 32 characters)
- ✅ Enable HTTPS (most platforms do this automatically)
- ✅ Use environment variables for secrets
- ✅ Regularly update dependencies
- ✅ Monitor for security vulnerabilities

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Verify environment variables
4. Test database connectivity

