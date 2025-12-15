import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ example: 'account-id-here' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Cash withdrawal', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

