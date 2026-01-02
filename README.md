[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/0UWyaad3)

# RevoBank API

Secure and scalable banking API backend built with NestJS, Prisma, and PostgreSQL (Supabase-ready). This API provides comprehensive banking operations including user management, account management, and transaction processing.

## 🚀 Features

### Authentication & Authorization

- User registration and login with JWT authentication
- Role-based access control (Customer & Admin)
- Protected routes with JWT guards
- Secure password hashing with bcrypt

### User Management

- User registration and authentication
- Profile management (view and update)
- Role-based permissions

### Account Management

- Create bank accounts with unique account numbers
- View all accounts (own accounts for customers, all accounts for admins)
- Update account information
- Delete accounts (with balance validation)

### Transaction Management

- **Deposit**: Add funds to an account
- **Withdraw**: Remove funds from an account (with balance validation)
- **Transfer**: Transfer funds between accounts
- View transaction history
- Detailed transaction information

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
  -- PostgreSQL database (Supabase/Railway recommended - see `RAILWAY_SETUP.md`)
- Git

## 🚀 Quick Start dengan Railway

**Project ini menggunakan PostgreSQL (Supabase/Railway) untuk database.**

1. **Setup Railway Database** (Lihat `RAILWAY_SETUP.md` untuk detail lengkap)
2. **Clone repository dan install dependencies**
3. **Set environment variables** (gunakan `POSTGRES_PUBLIC_URL` dari Railway/Supabase)
4. **Run migrations dan start server**

Lihat `RAILWAY_SETUP.md` untuk panduan lengkap setup Railway.

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mileston4
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   **Untuk Development Local dengan Postgres (Supabase/Railway):**
   ```env
   DATABASE_URL="postgresql://postgres:password@monorail.proxy.rlwy.net:5432/railway?schema=public&sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=development
   ```
   **Catatan:**

- Copy `POSTGRES_PUBLIC_URL` dari Railway/Supabase dashboard (Postgres service → Variables)
- Atau gunakan `POSTGRES_URL` jika backend juga di platform yang sama
- Lihat `.env.example` untuk template lengkap
- Lihat `RAILWAY_SETUP.md` untuk panduan setup Railway

4. **Set up Prisma**

   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate

   # Seed the database with sample data
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`
Swagger documentation will be available at `http://localhost:3000/api`

## 📚 API Documentation

### Swagger UI

Once the server is running, visit `http://localhost:3000/api` to access the interactive Swagger documentation.

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123!"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### User Endpoints

#### Get Profile

```http
GET /user/profile
Authorization: Bearer <jwt-token>
```

#### Update Profile

```http
PATCH /user/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

### Account Endpoints

#### Create Account

```http
POST /accounts
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "SAVINGS",
  "initialBalance": 1000.00
}
```

#### Get All Accounts

```http
GET /accounts
Authorization: Bearer <jwt-token>
```

#### Get Account by ID

```http
GET /accounts/:id
Authorization: Bearer <jwt-token>
```

#### Update Account

```http
PATCH /accounts/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "CHECKING"
}
```

#### Delete Account

```http
DELETE /accounts/:id
Authorization: Bearer <jwt-token>
```

### Transaction Endpoints

#### Deposit

```http
POST /transactions/deposit
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "accountId": "account-uuid",
  "amount": 1000.00,
  "description": "Initial deposit"
}
```

#### Withdraw

```http
POST /transactions/withdraw
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "accountId": "account-uuid",
  "amount": 500.00,
  "description": "Cash withdrawal"
}
```

#### Transfer

```http
POST /transactions/transfer
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fromAccountId": "account-uuid-1",
  "toAccountId": "account-uuid-2",
  "amount": 250.00,
  "description": "Transfer to savings"
}
```

#### Get All Transactions

```http
GET /transactions
Authorization: Bearer <jwt-token>
```

#### Get Transaction by ID

```http
GET /transactions/:id
Authorization: Bearer <jwt-token>
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## 🗄️ Database Schema

### User Model

- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String)
- `role` (Enum: CUSTOMER, ADMIN)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Account Model

- `id` (UUID, Primary Key)
- `accountNumber` (String, Unique)
- `balance` (Decimal)
- `type` (String)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Transaction Model

- `id` (UUID, Primary Key)
- `type` (Enum: DEPOSIT, WITHDRAW, TRANSFER)
- `status` (Enum: PENDING, COMPLETED, FAILED)
- `amount` (Decimal)
- `description` (String, Optional)
- `fromAccountId` (UUID, Foreign Key, Optional)
- `toAccountId` (UUID, Foreign Key, Optional)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation with class-validator
- Protected routes with guards
- SQL injection prevention (Prisma ORM)

## 🚢 Deployment (Supabase + Vercel)

This project is configured for **PostgreSQL (Supabase)** and is deployable on **Vercel** as a serverless API function. Below are the recommended steps and important production notes.

### Database (Supabase)

1. Create a project on https://supabase.com and add a Postgres database.
2. In your Supabase Project → Settings → Database → **Connection string**, copy the exact **Connection string (URI)**. There may also be a **Pooler** (pgbouncer) URI — try the **direct** URI first if you encounter pooler-specific errors.
3. Set the connection string as `DATABASE_URL` in your production environment (Vercel/Render/Railway). **Important:** paste the exact string from Supabase (no extra quotes, no whitespace).
4. Also set the Supabase client variables used by the app:
   - `SUPABASE_URL` (e.g. `https://<project>.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_KEY` (server-side key; keep secret)

Notes on pooler vs direct:

- If you see `FATAL: Tenant or user not found` when using the pooler URI, try the direct connection string instead.
- If you see DNS errors like `ENOTFOUND base`, the `DATABASE_URL` is malformed — verify you pasted the full URI exactly.

### Vercel Deployment

This repository includes a `vercel.json` that routes `/api/*` to the serverless function and serves the static landing page from `/public/index.html`.

Key notes:

- The `vercel-build` script in `package.json` runs `prisma:generate` before building to ensure the Prisma Client is available at build time.
- Serverless functions can cold-start and have limited connection lifetimes. The Prisma service in this project is defensive: it logs DB connect failures and won't crash the whole function on startup.
- Add these environment variables in Vercel (Production scope):
  - `DATABASE_URL` (exact Supabase connection string)
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET`

Routes and docs after deployment:

- Landing page: `https://<your-vercel-domain>/` (serves `public/index.html`)
- Redoc docs: `https://<your-vercel-domain>/api/docs` (uses stored OpenAPI JSON)
- Swagger UI: `https://<your-vercel-domain>/api/swagger` (mounted under `/api/swagger`)
- OpenAPI JSON: `https://<your-vercel-domain>/api/openapi.json`
- Debug endpoints (safe; do not expose secrets):
  - `/api/debug` — shows presence of env vars and Prisma connection status
  - `/api/file-check` — inspects whether `public/index.html` is present in the runtime

### Recommended Vercel settings

- Add `DATABASE_URL` and other env vars under **Production** (no surrounding quotes).
- If builds fail due to missing Prisma Client, ensure you have a `vercel-build` script that runs `prisma:generate` before `vercel` build step.

---

## 🔧 Local Development & Testing

1. Create a `.env` in project root (use `.env.example` as template) and set:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:[REDACTED]@<host>:5432/postgres?sslmode=require"
JWT_SECRET=[REDACTED_JWT_SECRET]
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[REDACTED_SERVICE_ROLE_KEY]
```

2. Install deps and generate Prisma client:

```bash
npm install
npm run prisma:generate
npm run prisma:seed  # optional
npm run start:dev
```

3. Open local docs:

- Swagger (interactive): `http://localhost:3000/api/swagger`
- Redoc (alternative): `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/api/health`

---

## 🐞 Troubleshooting

Common issues and quick fixes:

- 500 at startup / DB connection errors:

  - Verify `DATABASE_URL` is the exact connection string from Supabase (no quotes). Test parsing locally:
    ```powershell
    $env:DATABASE_URL = 'postgresql://user:pass@host:5432/db?sslmode=require'
    node -e "console.log(new URL(process.env.DATABASE_URL).hostname)"
    nslookup <hostname>
    ```
  - Quick connection test with Node `pg`:
    ```bash
    node -e "const { Client } = require('pg'); (async()=>{const c=new Client({connectionString:process.env.DATABASE_URL}); await c.connect(); console.log('connected'); await c.end();})().catch(e=>console.error(e))"
    ```
  - If pooler URI returns `Tenant or user not found`, switch to the direct connection string.

- Blank or 404 landing page on Vercel:

  - Ensure `vercel.json` routes are correct (this repo maps `/` and `/index.html` or serves landing from function if necessary).
  - Use `/api/file-check` to confirm the runtime contains `public/index.html`.

- Docs assets failing to load:

  - Swagger UI assets are mounted under `/api/swagger/*` (open `https://<domain>/api/swagger`).
  - Redoc is available at `/api/docs` and falls back to a simple HTML message if external assets fail.

- Check Vercel function logs for invocation errors (Vercel Dashboard → Functions → select function and view logs).

---

## 🧾 Additional Notes

- Keep all **service role keys** and DB credentials secret — do not commit them to the repo.
- For production, consider using connection pooling (Prisma Data Proxy or managed poolers) and proper secrets rotation.

If you'd like, I can add a short `README` badge and a summary section at the top with quick links to the live docs and health endpoints.

## 📝 Test Credentials

After running the seed script, you can use these credentials:

**Admin:**

- Email: `admin@revobank.com`
- Password: `admin123`

**Customer 1:**

- Email: `john.doe@example.com`
- Password: `customer123`

**Customer 2:**

- Email: `jane.smith@example.com`
- Password: `customer123`

## 🛠️ Technologies Used

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
  -- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **class-validator** - Validation decorators
- **Swagger / Redoc** - API documentation
- **Jest** - Testing framework

## 📦 Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── guards/       # JWT and role guards
│   ├── strategies/   # Passport strategies
│   └── decorators/   # Custom decorators
├── user/             # User module
│   ├── dto/
│   └── ...
├── account/          # Account module
│   ├── dto/
│   └── ...
├── transaction/      # Transaction module
│   ├── dto/
│   └── ...
├── prisma/           # Prisma service
└── main.ts           # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built as part of Milestone 4 - Banking API Backend Development

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running (or Supabase project is active)
- Check `DATABASE_URL` format: `postgresql://user:password@host:5432/database?schema=public&sslmode=require`
- Verify database exists

### Migration Issues

- Run `npm run prisma:generate` before migrations
- Ensure database is accessible
- Check Prisma schema syntax

### Authentication Issues

- Verify JWT_SECRET is set
- Check token expiration
- Ensure Bearer token is included in headers
