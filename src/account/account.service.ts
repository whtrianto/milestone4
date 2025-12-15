import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  private generateAccountNumber(): string {
    return 'REVO' + Math.random().toString().slice(2, 12);
  }

  async create(userId: string, createAccountDto: CreateAccountDto) {
    let accountNumber: string;
    let isUnique = false;

    // Generate unique account number
    while (!isUnique) {
      accountNumber = this.generateAccountNumber();
      const existing = await this.prisma.account.findUnique({
        where: { accountNumber },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    const account = await this.prisma.account.create({
      data: {
        accountNumber,
        type: createAccountDto.type,
        balance: createAccountDto.initialBalance || 0,
        userId,
      },
    });

    return account;
  }

  async findAll(userId: string, userRole: string) {
    // Admin can see all accounts, users can only see their own
    const where = userRole === 'ADMIN' ? {} : { userId };

    const accounts = await this.prisma.account.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return accounts;
  }

  async findOne(id: string, userId: string, userRole: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user has access (own account or admin)
    if (account.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this account');
    }

    return account;
  }

  async update(id: string, userId: string, userRole: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user has access
    if (account.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this account');
    }

    const updatedAccount = await this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });

    return updatedAccount;
  }

  async remove(id: string, userId: string, userRole: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user has access
    if (account.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this account');
    }

    // Check if account has balance
    if (account.balance.greaterThan(0)) {
      throw new ForbiddenException('Cannot delete account with balance');
    }

    await this.prisma.account.delete({
      where: { id },
    });

    return { message: 'Account deleted successfully' };
  }
}

