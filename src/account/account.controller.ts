import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: any,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountService.create(user.id, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: any) {
    return this.accountService.findAll(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.update(id, user.id, user.role, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountService.remove(id, user.id, user.role);
  }
}

