import { IsString, IsNotEmpty, IsOptional, IsUUID, IsArray, ValidateNested, IsInt, Matches } from "class-validator";
import { Type } from "class-transformer";

export class VenueScheduleDto {
    @IsInt()
    dayOfWeek!: number;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Time must be in HH:MM format",
    })
    openTime!: string;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Time must be in HH:MM format",
    })
    closeTime!: string;
}

export class CreateVenueDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsNotEmpty()
    renterId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VenueScheduleDto)
    @IsOptional()
    schedules?: VenueScheduleDto[];
}

export class UpdateVenueDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VenueScheduleDto)
    @IsOptional()
    schedules?: VenueScheduleDto[];
}

export class RejectVenueDto {
    @IsString()
    @IsNotEmpty()
    rejectionReason!: string;
}
