# Todo App - Full Stack Application

Aplikasi Todo sederhana dengan backend NestJS dan frontend React.

## Teknologi

- **Backend**: NestJS (Node.js)
- **Frontend**: React
- **Node Version**: 18.x atau lebih tinggi

## Cara Menjalankan

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend akan berjalan di `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend akan berjalan di `http://localhost:3000` (atau port lain jika 3000 sudah digunakan)

**Catatan**: Pastikan backend sudah berjalan sebelum menjalankan frontend.

## Menggunakan Docker

```bash
docker compose up --build
```

**Catatan**: Jika menggunakan Docker versi lama, gunakan `docker-compose` (dengan tanda hubung).

Backend akan tersedia di `http://localhost:3000`
Frontend akan tersedia di `http://localhost:80`

## API Endpoints

- `GET /api/todos?search=` - Mendapatkan daftar todo (dengan filter search opsional)
- `POST /api/todos` - Membuat todo baru `{ title: string }`
- `PATCH /api/todos/:id` - Toggle status completed todo

## Authentication

Backend memerlukan header `x-user-id` pada setiap request. Jika header tidak ada atau kosong, akan mengembalikan 401 Unauthorized.

Frontend secara default mengirim `x-user-id: user-123`. Untuk mengubahnya, set environment variable `REACT_APP_USER_ID`.

## Keputusan Teknis

1. **In-Memory Storage**: Data disimpan di memori untuk kesederhanaan. Data akan hilang saat server restart.

2. **Client-Side Search**: Search dilakukan di backend dengan filter pada field `title` untuk performa yang lebih baik dan mengurangi beban client.

3. **Middleware Authentication**: Menggunakan NestJS middleware untuk validasi header `x-user-id` secara global, memastikan semua endpoint terlindungi dengan konsisten.

