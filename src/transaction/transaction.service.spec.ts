import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    it('should deposit money successfully', async () => {
      const userId = '1';
      const depositDto = {
        accountId: '1',
        amount: 1000,
        description: 'Test deposit',
      };

      const mockAccount = {
        id: '1',
        userId,
        balance: 0,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          account: {
            update: jest.fn().mockResolvedValue({ ...mockAccount, balance: 1000 }),
          },
          transaction: {
            create: jest.fn().mockResolvedValue({
              id: '1',
              type: 'DEPOSIT',
              amount: 1000,
            }),
          },
        });
      });

      const result = await service.deposit(userId, depositDto);

      expect(result).toHaveProperty('type', 'DEPOSIT');
    });

    it('should throw NotFoundException if account not found', async () => {
      const userId = '1';
      const depositDto = {
        accountId: 'nonexistent',
        amount: 1000,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.deposit(userId, depositDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('withdraw', () => {
    it('should throw BadRequestException for insufficient balance', async () => {
      const userId = '1';
      const withdrawDto = {
        accountId: '1',
        amount: 1000,
      };

      const mockAccount = {
        id: '1',
        userId,
        balance: 500,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.withdraw(userId, withdrawDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('transfer', () => {
    it('should throw BadRequestException for same account transfer', async () => {
      const userId = '1';
      const transferDto = {
        fromAccountId: '1',
        toAccountId: '1',
        amount: 100,
      };

      await expect(service.transfer(userId, transferDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

