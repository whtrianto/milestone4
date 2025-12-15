import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe Updated', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'newemail@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}

