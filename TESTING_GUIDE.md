# 📋 Panduan Testing Manual RevoBank API

## 🚀 Persiapan

1. **Pastikan server berjalan**:

   ```bash
   npm run start:dev
   ```

2. **Buka Swagger UI**:

   - URL: `http://localhost:3000/api`
   - Atau: `http://localhost:3000/` (akan redirect ke `/api`)

3. **Pastikan database sudah di-seed**:
   - Database `revobank` sudah dibuat
   - Migration sudah dijalankan
   - Seed data sudah ada

---

## 📝 Test Credentials (dari seed)

**Admin:**

- Email: `admin@revobank.com`
- Password: `admin123`

**Customer 1:**

- Email: `john.doe@example.com`
- Password: `customer123`

**Customer 2:**

- Email: `jane.smith@example.com`
- Password: `customer123`

---

## 🧪 Step-by-Step Testing

### **Step 1: Register User Baru** ✅

1. Di Swagger UI, cari section **"Authentication"**
2. Klik endpoint `POST /auth/register`
3. Klik tombol **"Try it out"**
4. Isi request body:
   ```json
   {
     "email": "testuser@example.com",
     "name": "Test User",
     "password": "test123456"
   }
   ```
5. Klik **"Execute"**
6. **Expected Result**:
   - Status: `201 Created`
   - Response berisi `user` dan `access_token`
   - Copy `access_token` untuk step berikutnya

---

### **Step 2: Login** ✅

1. Klik endpoint `POST /auth/login`
2. Klik **"Try it out"**
3. Isi request body (gunakan customer 1):
   ```json
   {
     "email": "john.doe@example.com",
     "password": "customer123"
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `200 OK`
   - Response berisi `user` dan `access_token`
   - **PENTING**: Copy `access_token` ini!

---

### **Step 3: Authorize di Swagger** 🔐

1. Di bagian atas Swagger UI, cari tombol **"Authorize"** (🔒)
2. Klik tombol tersebut
3. Di field **"Value"**, paste `access_token` yang didapat dari login
4. Klik **"Authorize"**
5. Klik **"Close"**
6. Sekarang semua protected endpoints sudah ter-authenticate

**Note**: Token format di Swagger harus: `Bearer <token>` atau langsung `<token>`

---

### **Step 4: Get User Profile** 👤

1. Cari section **"User"**
2. Klik endpoint `GET /user/profile`
3. Klik **"Try it out"**
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `200 OK`
   - Response berisi profile user yang login
   - Email: `john.doe@example.com`

---

### **Step 5: Update Profile** ✏️

1. Klik endpoint `PATCH /user/profile`
2. Klik **"Try it out"**
3. Isi request body:
   ```json
   {
     "name": "John Doe Updated",
     "email": "john.doe@example.com"
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `200 OK`
   - Response berisi profile yang sudah di-update

---

### **Step 6: Create Account** 🏦

1. Cari section **"Accounts"**
2. Klik endpoint `POST /accounts`
3. Klik **"Try it out"**
4. Isi request body:
   ```json
   {
     "type": "SAVINGS",
     "initialBalance": 1000.0
   }
   ```
5. Klik **"Execute"**
6. **Expected Result**:
   - Status: `201 Created`
   - Response berisi account baru dengan:
     - `accountNumber` (format: REVO + angka)
     - `balance`: 1000.00
     - `type`: "SAVINGS"
   - **PENTING**: Copy `id` account ini untuk step berikutnya!

---

### **Step 7: Get All Accounts** 📋

1. Klik endpoint `GET /accounts`
2. Klik **"Try it out"**
3. Klik **"Execute"**
4. **Expected Result**:
   - Status: `200 OK`
   - Response berisi array accounts milik user
   - Harus ada minimal 1 account (dari seed atau yang baru dibuat)

---

### **Step 8: Get Account Detail** 🔍

1. Klik endpoint `GET /accounts/{id}`
2. Klik **"Try it out"**
3. Paste `id` account dari Step 6 ke parameter `id`
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `200 OK`
   - Response berisi detail account lengkap dengan user info

---

### **Step 9: Deposit** 💰

1. Cari section **"Transactions"**
2. Klik endpoint `POST /transactions/deposit`
3. Klik **"Try it out"**
4. Isi request body (gunakan account id dari Step 6):
   ```json
   {
     "accountId": "<paste-account-id-dari-step-6>",
     "amount": 500.0,
     "description": "Test deposit"
   }
   ```
5. Klik **"Execute"**
6. **Expected Result**:
   - Status: `201 Created`
   - Response berisi transaction record
   - Balance account sekarang: 1500.00 (1000 + 500)

---

### **Step 10: Withdraw** 💸

1. Klik endpoint `POST /transactions/withdraw`
2. Klik **"Try it out"**
3. Isi request body:
   ```json
   {
     "accountId": "<paste-account-id-dari-step-6>",
     "amount": 200.0,
     "description": "Test withdrawal"
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `201 Created`
   - Response berisi transaction record
   - Balance account sekarang: 1300.00 (1500 - 200)

---

### **Step 11: Test Withdraw dengan Saldo Tidak Cukup** ❌

1. Klik endpoint `POST /transactions/withdraw` lagi
2. Klik **"Try it out"**
3. Isi request body dengan amount lebih besar dari balance:
   ```json
   {
     "accountId": "<paste-account-id-dari-step-6>",
     "amount": 5000.0,
     "description": "Test insufficient balance"
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `400 Bad Request`
   - Error message: "Insufficient balance"
   - Balance tidak berubah

---

### **Step 12: Create Account Kedua** 🏦

1. Kembali ke `POST /accounts`
2. Klik **"Try it out"**
3. Isi request body:
   ```json
   {
     "type": "CHECKING",
     "initialBalance": 500.0
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `201 Created`
   - Response berisi account kedua
   - **PENTING**: Copy `id` account kedua ini!

---

### **Step 13: Transfer** 🔄

1. Klik endpoint `POST /transactions/transfer`
2. Klik **"Try it out"**
3. Isi request body:
   ```json
   {
     "fromAccountId": "<paste-account-id-pertama>",
     "toAccountId": "<paste-account-id-kedua>",
     "amount": 300.0,
     "description": "Test transfer"
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `201 Created`
   - Response berisi transaction record
   - Account pertama balance: 1000.00 (1300 - 300)
   - Account kedua balance: 800.00 (500 + 300)

---

### **Step 14: Test Transfer ke Akun yang Sama** ❌

1. Klik endpoint `POST /transactions/transfer` lagi
2. Klik **"Try it out"**
3. Isi request body dengan fromAccountId dan toAccountId sama:
   ```json
   {
     "fromAccountId": "<paste-account-id-pertama>",
     "toAccountId": "<paste-account-id-pertama>",
     "amount": 100.0,
     "description": "Test same account"
   }
   ```
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `400 Bad Request`
   - Error message: "Cannot transfer to the same account"

---

### **Step 15: Get All Transactions** 📊

1. Klik endpoint `GET /transactions`
2. Klik **"Try it out"**
3. Klik **"Execute"**
4. **Expected Result**:
   - Status: `200 OK`
   - Response berisi array semua transactions milik user
   - Harus ada minimal:
     - 1 deposit transaction
     - 1 withdraw transaction
     - 1 transfer transaction
     - Transactions dari seed data

---

### **Step 16: Get Transaction Detail** 🔍

1. Klik endpoint `GET /transactions/{id}`
2. Klik **"Try it out"**
3. Copy `id` dari salah satu transaction di Step 15
4. Paste ke parameter `id`
5. Klik **"Execute"**
6. **Expected Result**:
   - Status: `200 OK`
   - Response berisi detail transaction lengkap dengan account info

---

### **Step 17: Update Account** ✏️

1. Kembali ke section **"Accounts"**
2. Klik endpoint `PATCH /accounts/{id}`
3. Klik **"Try it out"**
4. Paste account id ke parameter `id`
5. Isi request body:
   ```json
   {
     "type": "CHECKING"
   }
   ```
6. Klik **"Execute"**
7. **Expected Result**:
   - Status: `200 OK`
   - Response berisi account yang sudah di-update

---

### **Step 18: Test Delete Account dengan Balance** ❌

1. Klik endpoint `DELETE /accounts/{id}`
2. Klik **"Try it out"**
3. Paste account id yang masih ada balance
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `403 Forbidden`
   - Error message: "Cannot delete account with balance"

---

### **Step 19: Delete Account (Balance = 0)** ✅

1. Buat account baru dengan balance 0:
   ```json
   {
     "type": "SAVINGS",
     "initialBalance": 0
   }
   ```
2. Copy `id` account baru
3. Klik endpoint `DELETE /accounts/{id}`
4. Paste account id
5. Klik **"Execute"**
6. **Expected Result**:
   - Status: `200 OK`
   - Response: `{ "message": "Account deleted successfully" }`

---

### **Step 20: Test Unauthorized Access** 🔒

1. Klik tombol **"Authorize"** di Swagger
2. Klik **"Logout"** atau hapus token
3. Coba akses `GET /user/profile`
4. Klik **"Execute"**
5. **Expected Result**:
   - Status: `401 Unauthorized`
   - Error message tentang authentication

---

## 🧪 Testing dengan Postman/Thunder Client (Alternatif)

### Setup Postman/Thunder Client

1. **Install Postman** atau **Thunder Client** (VS Code extension)

2. **Create Collection**:

   - Buat collection baru: "RevoBank API"

3. **Setup Environment Variables**:
   - `base_url`: `http://localhost:3000`
   - `token`: (akan diisi setelah login)

### Testing Flow

1. **Register**:

   ```
   POST {{base_url}}/auth/register
   Body: { "email": "...", "name": "...", "password": "..." }
   ```

2. **Login**:

   ```
   POST {{base_url}}/auth/login
   Body: { "email": "...", "password": "..." }
   ```

   - Copy `access_token` dari response
   - Set sebagai environment variable `token`

3. **Set Authorization Header**:

   - Di semua protected requests, tambahkan header:

   ```
   Authorization: Bearer {{token}}
   ```

4. **Test semua endpoints** seperti di Swagger

---

## ✅ Checklist Testing

Gunakan checklist ini untuk memastikan semua sudah di-test:

- [ ] Register user baru
- [ ] Login
- [ ] Get profile
- [ ] Update profile
- [ ] Create account
- [ ] Get all accounts
- [ ] Get account detail
- [ ] Update account
- [ ] Deposit
- [ ] Withdraw
- [ ] Withdraw dengan saldo tidak cukup (error)
- [ ] Transfer
- [ ] Transfer ke akun yang sama (error)
- [ ] Get all transactions
- [ ] Get transaction detail
- [ ] Delete account dengan balance (error)
- [ ] Delete account dengan balance = 0
- [ ] Unauthorized access (error)

---

## 🐛 Troubleshooting

### Error: "401 Unauthorized"

- **Solusi**: Pastikan sudah klik "Authorize" di Swagger dan paste token
- Atau pastikan header `Authorization: Bearer <token>` ada di request

### Error: "403 Forbidden"

- **Solusi**: Pastikan user memiliki akses ke resource tersebut
- User hanya bisa akses account/transaction miliknya sendiri

### Error: "404 Not Found"

- **Solusi**: Pastikan ID yang digunakan valid
- Pastikan resource memang ada di database

### Error: "400 Bad Request"

- **Solusi**: Cek request body sesuai dengan DTO
- Pastikan semua required fields terisi
- Cek validasi (email format, password length, dll)

### Token Expired

- **Solusi**: Login lagi untuk mendapatkan token baru
- Token default expire dalam 7 hari (bisa diubah di `.env`)

---

## 📊 Verifikasi di Database

Setelah testing, verifikasi data di database:

1. **Buka phpMyAdmin**: `http://localhost/phpmyadmin`
2. **Pilih database**: `revobank`
3. **Cek tabel**:
   - `users`: Pastikan user baru sudah terbuat
   - `accounts`: Pastikan accounts sudah terbuat dengan balance yang benar
   - `transactions`: Pastikan semua transactions sudah tercatat

Atau gunakan Prisma Studio:

```bash
npm run prisma:studio
```

Buka: `http://localhost:5555`

---

## 🎉 Selesai!

