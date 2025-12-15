# Database Setup untuk RevoBank

## 📋 Informasi Database

- **Database Name:** `revobank`
- **Type:** MySQL
- **Host:** `localhost:3306`
- **User:** `root` (default XAMPP)

## 🗄️ Struktur Tabel

### 1. Tabel `users` (Pengguna)

Menyimpan data pengguna sistem (customer dan admin).

**Kolom:**

- `id` - UUID (Primary Key)
- `email` - Email pengguna (Unique)
- `password` - Password ter-hash
- `name` - Nama pengguna
- `role` - Role pengguna (CUSTOMER atau ADMIN)
- `createdAt` - Tanggal dibuat
- `updatedAt` - Tanggal diupdate

### 2. Tabel `accounts` (Rekening)

Menyimpan data rekening bank pengguna.

**Kolom:**

- `id` - UUID (Primary Key)
- `accountNumber` - Nomor rekening (Unique)
- `balance` - Saldo rekening (Decimal 15,2)
- `type` - Tipe rekening (SAVINGS, CHECKING, dll)
- `userId` - Foreign Key ke tabel users
- `createdAt` - Tanggal dibuat
- `updatedAt` - Tanggal diupdate

### 3. Tabel `transactions` (Transaksi)

Menyimpan data transaksi (deposit, withdraw, transfer).

**Kolom:**

- `id` - UUID (Primary Key)
- `type` - Tipe transaksi (DEPOSIT, WITHDRAW, TRANSFER)
- `status` - Status transaksi (PENDING, COMPLETED, FAILED)
- `amount` - Jumlah transaksi (Decimal 15,2)
- `description` - Deskripsi transaksi (Optional)
- `fromAccountId` - Rekening asal (untuk WITHDRAW dan TRANSFER)
- `toAccountId` - Rekening tujuan (untuk DEPOSIT dan TRANSFER)
- `userId` - Foreign Key ke tabel users
- `createdAt` - Tanggal dibuat
- `updatedAt` - Tanggal diupdate

## 🚀 Cara Setup Database

### Opsi 1: Menggunakan Prisma (Recommended)

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (akan membuat tabel otomatis)
npm run prisma:migrate

# Seed database dengan data sample
npm run prisma:seed
```

### Opsi 2: Manual dengan SQL Script

1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Buat database baru dengan nama `revobank`
3. Pilih database `revobank`
4. Klik tab "SQL"
5. Copy dan paste isi file `database/create_tables.sql`
6. Klik "Go" untuk menjalankan

### Opsi 3: Menggunakan MySQL Command Line

```bash
# Masuk ke MySQL
mysql -u root

# Buat database
CREATE DATABASE revobank;

# Gunakan database
USE revobank;

# Jalankan script SQL
SOURCE database/create_tables.sql;
```

## 📊 Relasi Tabel

```
users (1) ──< (many) accounts
users (1) ──< (many) transactions
accounts (1) ──< (many) transactions [fromAccountId]
accounts (1) ──< (many) transactions [toAccountId]
```

## 🔍 Query Contoh

### Melihat semua pengguna

```sql
SELECT * FROM users;
```

### Melihat semua rekening dengan nama pemilik

```sql
SELECT
    a.id,
    a.accountNumber,
    a.balance,
    a.type,
    u.name AS owner_name,
    u.email AS owner_email
FROM accounts a
JOIN users u ON a.userId = u.id;
```

### Melihat transaksi dengan detail rekening

```sql
SELECT
    t.id,
    t.type,
    t.amount,
    t.status,
    t.description,
    t.createdAt,
    fa.accountNumber AS from_account,
    ta.accountNumber AS to_account,
    u.name AS user_name
FROM transactions t
LEFT JOIN accounts fa ON t.fromAccountId = fa.id
LEFT JOIN accounts ta ON t.toAccountId = ta.id
JOIN users u ON t.userId = u.id
ORDER BY t.createdAt DESC;
```

## 🛠️ Maintenance

### Backup Database

```bash
mysqldump -u root revobank > backup_revobank.sql
```

### Restore Database

```bash
mysql -u root revobank < backup_revobank.sql
```

### Reset Database (Hapus semua data)

```sql
-- Hati-hati! Ini akan menghapus semua data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transactions;
TRUNCATE TABLE accounts;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
```

## 📝 Catatan

- Semua ID menggunakan UUID (VARCHAR 191)
- Saldo menggunakan DECIMAL(15,2) untuk presisi
- Foreign keys menggunakan CASCADE untuk users dan SET NULL untuk accounts
- Index sudah dibuat untuk kolom yang sering di-query
