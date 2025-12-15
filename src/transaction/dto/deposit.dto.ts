import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: 'account-id-here' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ example: 1000.0 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Initial deposit', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

