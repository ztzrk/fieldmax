import { Type, Transform } from "class-transformer";
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    IsArray,
} from "class-validator";

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    status?: "PENDING" | "APPROVED" | "REJECTED";

    @IsOptional()
    @Transform(({ value }) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    })
    isClosed?: boolean;

    @IsOptional()
    @IsString()
    sportTypeId?: string;
}

export class ReviewFilterDto extends PaginationDto {
    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value.map(Number);
        if (typeof value === "string") return [Number(value)];
        return value;
    })
    @IsArray()
    @IsInt({ each: true })
    ratings?: number[];
}
