import { Type } from "class-transformer";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    IsNumber,
    Min,
    Max,
    ValidateNested,
    IsArray,
    IsBoolean,
} from "class-validator";

export class CreateFieldDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsUUID()
    @IsNotEmpty()
    venueId!: string;

    @IsUUID()
    @IsNotEmpty()
    sportTypeId!: string;

    @IsNumber()
    @Min(0)
    pricePerHour!: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isClosed?: boolean;
}

export class UpdateFieldDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsUUID()
    @IsOptional()
    sportTypeId?: string;

    @IsBoolean()
    @IsOptional()
    isClosed?: boolean;
}


export class RejectFieldDto {
    @IsString()
    @IsNotEmpty()
    rejectionReason!: string;
}

export class ToggleFieldClosureDto {
    @IsBoolean()
    @IsNotEmpty()
    isClosed!: boolean;
}

