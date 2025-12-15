# Scripts Helper untuk RevoBank

Koleksi script PowerShell untuk membantu development.

## 📋 Daftar Script

### 1. `clear-port.ps1`
Membersihkan port yang digunakan oleh proses lain.

**Usage:**
```powershell
# Membersihkan port 3000 (default)
.\scripts\clear-port.ps1

# Membersihkan port tertentu
.\scripts\clear-port.ps1 -Port 3001
```

**Contoh:**
```powershell
PS> .\scripts\clear-port.ps1 -Port 3000
Mencari proses yang menggunakan port 3000...
Ditemukan proses yang menggunakan port 3000:
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       12345
Menghentikan proses: node (PID: 12345)...
Proses berhasil dihentikan!
```

### 2. `start-server.ps1`
Memulai development server dengan membersihkan port terlebih dahulu.

**Usage:**
```powershell
# Start server di port 3000 (default)
.\scripts\start-server.ps1

# Start server di port tertentu
.\scripts\start-server.ps1 -Port 3001
```

**Fitur:**
- Otomatis membersihkan port sebelum start
- Menampilkan status proses
- Menjalankan `npm run start:dev`

## 🚀 Quick Start

### Jika port 3000 sudah digunakan:
```powershell
# Opsi 1: Gunakan script clear-port
.\scripts\clear-port.ps1

# Opsi 2: Gunakan script start-server (otomatis clear port)
.\scripts\start-server.ps1
```

### Manual (tanpa script):
```powershell
# Cari proses yang menggunakan port
netstat -ano | findstr :3000

# Hentikan proses (ganti 12345 dengan PID yang ditemukan)
taskkill /PID 12345 /F

# Start server
npm run start:dev
```

## 📝 Catatan

- Script ini hanya untuk Windows PowerShell
- Pastikan Anda memiliki permission untuk menghentikan proses
- Script akan otomatis mencari dan menghentikan semua proses yang menggunakan port tertentu

## 🔧 Troubleshooting

### Error: "Cannot bind parameter"
- Pastikan Anda menjalankan script dari direktori project
- Gunakan path lengkap: `.\scripts\clear-port.ps1`

### Error: "Access Denied"
- Jalankan PowerShell sebagai Administrator
- Atau gunakan `taskkill` manual dengan admin rights

### Port masih digunakan setelah clear
- Tunggu beberapa detik (1-2 detik) sebelum start server
- Cek lagi dengan `netstat -ano | findstr :3000`
- Restart terminal/PowerShell jika perlu

