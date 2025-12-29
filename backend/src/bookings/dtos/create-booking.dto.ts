import { IsDateString, IsNotEmpty, IsString, IsUUID, IsNumber, IsOptional } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    @IsNotEmpty()
    fieldId!: string;

    @IsDateString()
    @IsNotEmpty()
    bookingDate!: string;

    @IsString()
    @IsNotEmpty()
    startTime!: string;

    @IsNumber()
    @IsOptional()
    duration?: number;
}
