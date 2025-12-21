import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateSportTypeDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class UpdateSportTypeDto {
    @IsString()
    @IsOptional()
    name?: string;
}
