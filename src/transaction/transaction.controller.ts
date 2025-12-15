import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to account' })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async deposit(@CurrentUser() user: any, @Body() depositDto: DepositDto) {
    return this.transactionService.deposit(user.id, depositDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from account' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Bad request or insufficient balance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async withdraw(@CurrentUser() user: any, @Body() withdrawDto: WithdrawDto) {
    return this.transactionService.withdraw(user.id, withdrawDto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiResponse({ status: 201, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Bad request or insufficient balance' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    return this.transactionService.transfer(user.id, transferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: any) {
    return this.transactionService.findAll(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionService.findOne(id, user.id, user.role);
  }
}

