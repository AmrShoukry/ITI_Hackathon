import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AdminUserRole {
  GUEST = 'GUEST',
  RENTER = 'RENTER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

export enum AdminUserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
}

export class UpdateUserRoleDto {
  @IsEnum(AdminUserRole)
  @ApiProperty({ enum: AdminUserRole, description: 'New role for the user' })
  roleName: AdminUserRole;
}

export class UpdateUserStatusDto {
  @IsEnum(AdminUserStatus)
  @ApiProperty({ enum: AdminUserStatus, description: 'New status for the user' })
  status: AdminUserStatus;
}

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Category name in English' })
  nameEn: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Category name in Arabic' })
  nameAr: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Category description in English' })
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Category description in Arabic' })
  descriptionAr?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false, description: 'Category name in English' })
  nameEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false, description: 'Category name in Arabic' })
  nameAr?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Category description in English' })
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Category description in Arabic' })
  descriptionAr?: string;
}

export class UpdateAdminSettingDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Setting value' })
  settingValue: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Setting description' })
  description?: string;
}
