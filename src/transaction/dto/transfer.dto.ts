import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({ example: 'from-account-id-here' })
  @IsString()
  @IsNotEmpty()
  fromAccountId: string;

  @ApiProperty({ example: 'to-account-id-here' })
  @IsString()
  @IsNotEmpty()
  toAccountId: string;

  @ApiProperty({ example: 250.0 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Transfer to savings', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

