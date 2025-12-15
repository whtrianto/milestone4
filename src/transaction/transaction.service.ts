import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: string, depositDto: DepositDto) {
    const { accountId, amount, description } = depositDto;

    // Find account
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user owns the account
    if (account.userId !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    // Perform deposit transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: new Decimal(amount),
          description: description || 'Deposit',
          toAccountId: accountId,
          userId,
        },
      });

      return { account: updatedAccount, transaction };
    });

    return result.transaction;
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    const { accountId, amount, description } = withdrawDto;

    // Find account
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user owns the account
    if (account.userId !== userId) {
      throw new ForbiddenException('You do not have access to this account');
    }

    // Check if sufficient balance
    if (account.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Perform withdrawal transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: 'WITHDRAW',
          status: 'COMPLETED',
          amount: new Decimal(amount),
          description: description || 'Withdrawal',
          fromAccountId: accountId,
          userId,
        },
      });

      return { account: updatedAccount, transaction };
    });

    return result.transaction;
  }

  async transfer(userId: string, transferDto: TransferDto) {
    const { fromAccountId, toAccountId, amount, description } = transferDto;

    // Check if from and to accounts are different
    if (fromAccountId === toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    // Find both accounts
    const fromAccount = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });

    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    // Check if user owns the from account
    if (fromAccount.userId !== userId) {
      throw new ForbiddenException('You do not have access to the source account');
    }

    // Check if sufficient balance
    if (fromAccount.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Perform transfer transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update from account balance
      const updatedFromAccount = await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Update to account balance
      const updatedToAccount = await tx.account.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: new Decimal(amount),
          description: description || 'Transfer',
          fromAccountId,
          toAccountId,
          userId,
        },
        include: {
          fromAccount: {
            select: {
              id: true,
              accountNumber: true,
            },
          },
          toAccount: {
            select: {
              id: true,
              accountNumber: true,
            },
          },
        },
      });

      return { transaction };
    });

    return result.transaction;
  }

  async findAll(userId: string, userRole: string) {
    // Admin can see all transactions, users can only see their own
    const where = userRole === 'ADMIN' ? {} : { userId };

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            type: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            type: true,
          },
        },
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

    return transactions;
  }

  async findOne(id: string, userId: string, userRole: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            type: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            type: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Check if user has access (own transaction or admin)
    if (transaction.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have access to this transaction');
    }

    return transaction;
  }
}

