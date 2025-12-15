import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = '1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = '1';
      const updateDto = { name: 'Updated Name' };
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, updateDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException if email already in use', async () => {
      const userId = '1';
      const updateDto = { email: 'existing@example.com' };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '2',
        email: 'existing@example.com',
      });

      await expect(service.updateProfile(userId, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});

