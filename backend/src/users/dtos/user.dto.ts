// src/users/dtos/update-user.dto.ts
import { IsEmail, IsString, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "@prisma/client";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    fullName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
