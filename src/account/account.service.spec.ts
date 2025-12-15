import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

  const mockPrismaService = {
    account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an account successfully', async () => {
      const userId = '1';
      const createDto = { type: 'SAVINGS' };
      const mockAccount = {
        id: '1',
        accountNumber: 'REVO1234567890',
        type: 'SAVINGS',
        balance: 0,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.account.findUnique.mockResolvedValue(null);
      mockPrismaService.account.create.mockResolvedValue(mockAccount);

      const result = await service.create(userId, createDto);

      expect(result).toHaveProperty('accountNumber');
      expect(result.type).toBe('SAVINGS');
    });
  });

  describe('findOne', () => {
    it('should return account if user owns it', async () => {
      const accountId = '1';
      const userId = '1';
      const mockAccount = {
        id: accountId,
        userId,
        accountNumber: 'REVO1234567890',
        type: 'SAVINGS',
        balance: 1000,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await service.findOne(accountId, userId, 'CUSTOMER');

      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account not found', async () => {
      const accountId = 'nonexistent';
      const userId = '1';

      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.findOne(accountId, userId, 'CUSTOMER')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own account', async () => {
      const accountId = '1';
      const userId = '2';
      const mockAccount = {
        id: accountId,
        userId: '1',
        accountNumber: 'REVO1234567890',
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.findOne(accountId, userId, 'CUSTOMER')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

