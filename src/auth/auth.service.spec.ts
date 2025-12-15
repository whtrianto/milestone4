import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
        role: 'CUSTOMER',
        createdAt: new Date(),
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('jwt-token');
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: loginDto.email,
        password: hashedPassword,
        name: 'Test User',
        role: 'CUSTOMER',
        createdAt: new Date(),
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('jwt-token');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: loginDto.email,
        password: hashedPassword,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

