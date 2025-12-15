[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/0UWyaad3)

# RevoBank API

Secure and scalable banking API backend built with NestJS, Prisma, and MySQL. This API provides comprehensive banking operations including user management, account management, and transaction processing.

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
- MySQL database (or use cloud services like TigerData, Supabase)
- Git

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
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/revobank"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   ```

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

## 🚢 Deployment

### Database Deployment

#### Option 1: TigerData
1. Create an account on [TigerData](https://tigerdata.com)
2. Create a new MySQL database
3. Update `DATABASE_URL` in your environment variables

#### Option 2: Supabase
1. Create a project on [Supabase](https://supabase.com)
2. Get your database connection string
3. Update `DATABASE_URL` in your environment variables

### Backend Deployment

#### Option 1: Render
1. Connect your GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm run start:prod`
4. Add environment variables
5. Run migrations: `npm run prisma:migrate deploy`

#### Option 2: Railway
1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add MySQL database service
4. Set environment variables
5. Deploy

#### Option 3: Fly.io
1. Install Fly CLI: `npm install -g @fly/cli`
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Set secrets: `fly secrets set DATABASE_URL=...`
5. Deploy: `fly deploy`

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
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **class-validator** - Validation decorators
- **Swagger** - API documentation
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
- Ensure MySQL is running
- Check `DATABASE_URL` format: `mysql://user:password@host:port/database`
- Verify database exists

### Migration Issues
- Run `npm run prisma:generate` before migrations
- Ensure database is accessible
- Check Prisma schema syntax

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Bearer token is included in headers
