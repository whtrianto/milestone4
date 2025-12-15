import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@revobank.com' },
    update: {},
    create: {
      email: 'admin@revobank.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create customer users
  const customer1Password = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: customer1Password,
      role: UserRole.CUSTOMER,
    },
  });
  console.log('✅ Customer 1 created:', customer1.email);

  const customer2Password = await bcrypt.hash('customer123', 10);
  const customer2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: customer2Password,
      role: UserRole.CUSTOMER,
    },
  });
  console.log('✅ Customer 2 created:', customer2.email);

  // Create accounts for customer1
  const account1 = await prisma.account.create({
    data: {
      accountNumber: 'REVO' + Math.random().toString().slice(2, 12),
      type: 'SAVINGS',
      balance: 5000.0,
      userId: customer1.id,
    },
  });
  console.log('✅ Account 1 created:', account1.accountNumber);

  const account2 = await prisma.account.create({
    data: {
      accountNumber: 'REVO' + Math.random().toString().slice(2, 12),
      type: 'CHECKING',
      balance: 2000.0,
      userId: customer1.id,
    },
  });
  console.log('✅ Account 2 created:', account2.accountNumber);

  // Create account for customer2
  const account3 = await prisma.account.create({
    data: {
      accountNumber: 'REVO' + Math.random().toString().slice(2, 12),
      type: 'SAVINGS',
      balance: 3000.0,
      userId: customer2.id,
    },
  });
  console.log('✅ Account 3 created:', account3.accountNumber);

  // Create sample transactions
  const transaction1 = await prisma.transaction.create({
    data: {
      type: 'DEPOSIT',
      status: 'COMPLETED',
      amount: 5000.0,
      description: 'Initial deposit',
      toAccountId: account1.id,
      userId: customer1.id,
    },
  });
  console.log('✅ Transaction 1 created');

  const transaction2 = await prisma.transaction.create({
    data: {
      type: 'DEPOSIT',
      status: 'COMPLETED',
      amount: 2000.0,
      description: 'Initial deposit',
      toAccountId: account2.id,
      userId: customer1.id,
    },
  });
  console.log('✅ Transaction 2 created');

  const transaction3 = await prisma.transaction.create({
    data: {
      type: 'TRANSFER',
      status: 'COMPLETED',
      amount: 500.0,
      description: 'Transfer to savings',
      fromAccountId: account2.id,
      toAccountId: account1.id,
      userId: customer1.id,
    },
  });
  console.log('✅ Transaction 3 created');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@revobank.com / admin123');
  console.log('Customer 1: john.doe@example.com / customer123');
  console.log('Customer 2: jane.smith@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

