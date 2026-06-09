import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

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
  roleName: AdminUserRole;
}

export class UpdateUserStatusDto {
  @IsEnum(AdminUserStatus)
  status: AdminUserStatus;
}

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  nameEn: string;

  @IsString()
  @MinLength(2)
  nameAr: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nameEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  nameAr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;
}

export class UpdateAdminSettingDto {
  @IsString()
  @MinLength(1)
  settingValue: string;

  @IsOptional()
  @IsString()
  description?: string;
}
