import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty({ example: 'CHECKING', required: false })
  @IsString()
  @IsOptional()
  type?: string;
}

