# 🔐 Panduan Mengambil Token dari Swagger Response

## ❌ Masalah yang Anda Alami

Anda mendapat error `401 Unauthorized` karena **password salah**.

**Password yang Anda gunakan:**
```
SecurePassword123!
```

**Password yang benar (dari seed data):**
```
customer123
```

---

## ✅ Cara Login yang Benar

### Request Body yang Benar:

```json
{
  "email": "john.doe@example.com",
  "password": "customer123"
}
```

### Response yang Benar (Status 200):

```json
{
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "createdAt": "2025-12-07T..."
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkLWhlcmUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzM0NjE5NTU4LCJleHAiOjE3MzUyMjQzNTh9.xxxxx"
}
```

---

## 📍 Di Mana Token Berada?

Token berada di field **`access_token`** dalam response body.

**Lokasi:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // ↑ INI TOKENNYA
}
```

---

## 🔑 Cara Menggunakan Token di Swagger

### Step 1: Copy Token dari Response

Setelah login berhasil, copy seluruh value dari field `access_token`:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkLWhlcmUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzM0NjE5NTU4LCJleHAiOjE3MzUyMjQzNTh9.xxxxx
```

### Step 2: Authorize di Swagger

1. Di bagian atas Swagger UI, cari tombol **"Authorize"** (🔒 icon)
2. Klik tombol tersebut
3. Akan muncul popup dengan field **"Value"**
4. Paste token yang sudah di-copy ke field tersebut
5. **PENTING**: Jangan tambahkan "Bearer" di depan, langsung paste token saja
6. Klik **"Authorize"**
7. Klik **"Close"**

### Step 3: Verifikasi

Setelah authorize, semua endpoint yang memerlukan authentication akan otomatis menggunakan token tersebut. Anda bisa langsung test endpoint protected seperti:
- `GET /user/profile`
- `GET /accounts`
- `POST /transactions/deposit`
- dll

---

## 📝 Test Credentials Lengkap

### Admin:
```json
{
  "email": "admin@revobank.com",
  "password": "admin123"
}
```

### Customer 1:
```json
{
  "email": "john.doe@example.com",
  "password": "customer123"
}
```

### Customer 2:
```json
{
  "email": "jane.smith@example.com",
  "password": "customer123"
}
```

---

## 🎯 Contoh Lengkap: Login → Ambil Token → Authorize

### 1. Login Request:
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "customer123"
}
```

### 2. Response (Success):
```json
{
  "user": {
    "id": "abc123-def456-...",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "createdAt": "2025-12-07T15:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMxMjMtZGVmNDU2Iiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzM0NjE5NTU4LCJleHAiOjE3MzUyMjQzNTh9.signature"
}
```

### 3. Copy Token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMxMjMtZGVmNDU2Iiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzM0NjE5NTU4LCJleHAiOjE3MzUyMjQzNTh9.signature
```

### 4. Paste di Swagger Authorize:
- Klik tombol "Authorize" (🔒)
- Paste token di field "Value"
- Klik "Authorize"
- Klik "Close"

### 5. Test Protected Endpoint:
- Klik `GET /user/profile`
- Klik "Try it out"
- Klik "Execute"
- **Expected**: Status 200 dengan profile data

---

## 🐛 Troubleshooting

### Error: "Invalid credentials"
- **Penyebab**: Password salah
- **Solusi**: Gunakan password yang benar:
  - `customer123` untuk customer
  - `admin123` untuk admin

### Error: "401 Unauthorized" setelah authorize
- **Penyebab**: Token tidak valid atau expired
- **Solusi**: 
  1. Login lagi untuk mendapatkan token baru
  2. Pastikan copy seluruh token (biasanya sangat panjang)
  3. Jangan tambahkan "Bearer" di Swagger (Swagger sudah handle itu)

### Token tidak muncul di response
- **Penyebab**: Login gagal
- **Solusi**: 
  1. Cek email dan password benar
  2. Pastikan user sudah terdaftar di database
  3. Cek response error untuk detail

---

## 📸 Visual Guide

### Response Body Structure:
```
{
  "user": { ... },           ← User information
  "access_token": "..."      ← TOKEN ADA DI SINI! Copy ini
}
```

### Swagger Authorize Dialog:
```
┌─────────────────────────────┐
│ Authorize                    │
├─────────────────────────────┤
│ Available authorizations    │
│                             │
│ JWT-auth (http, Bearer)     │
│ Value: [paste token here]   │ ← Paste token di sini
│                             │
│ [Authorize] [Close]         │
└─────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Login dengan password yang benar (`customer123`)
- [ ] Response status: `200 OK`
- [ ] Response body berisi `access_token`
- [ ] Copy seluruh value dari `access_token`
- [ ] Klik "Authorize" di Swagger
- [ ] Paste token di field "Value"
- [ ] Klik "Authorize" dan "Close"
- [ ] Test protected endpoint (harus berhasil)

---

**Sekarang coba login lagi dengan password yang benar!** 🚀

