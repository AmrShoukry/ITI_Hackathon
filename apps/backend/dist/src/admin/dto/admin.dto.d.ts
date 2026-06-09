export declare enum AdminUserRole {
    GUEST = "GUEST",
    RENTER = "RENTER",
    OWNER = "OWNER",
    ADMIN = "ADMIN"
}
export declare enum AdminUserStatus {
    Active = "Active",
    Suspended = "Suspended"
}
export declare class UpdateUserRoleDto {
    roleName: AdminUserRole;
}
export declare class UpdateUserStatusDto {
    status: AdminUserStatus;
}
export declare class CreateCategoryDto {
    nameEn: string;
    nameAr: string;
    descriptionEn?: string;
    descriptionAr?: string;
}
export declare class UpdateCategoryDto {
    nameEn?: string;
    nameAr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
}
export declare class UpdateAdminSettingDto {
    settingValue: string;
    description?: string;
}
