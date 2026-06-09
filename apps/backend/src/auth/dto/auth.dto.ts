import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Full name of the user' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'Password (min 6 characters)' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Role name (RENTER or OWNER)', example: 'RENTER' })
  roleName?: string; // "RENTER" or "OWNER"

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Preferred language (en or ar)' })
  preferredLanguage?: string; // "en" or "ar"

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'URL to national ID (for Owner verification)', example: 'https://...' })
  nationalIdUrl?: string; // Required if registering as Owner
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'User password' })
  password: string;
}
