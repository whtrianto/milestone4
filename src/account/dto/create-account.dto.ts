import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'SAVINGS' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '1000.00', required: false })
  @IsOptional()
  initialBalance?: number;
}

