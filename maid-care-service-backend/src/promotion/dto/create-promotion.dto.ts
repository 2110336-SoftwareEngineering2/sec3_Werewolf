import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  Min,
  Max,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @Min(0)
  @Max(100)
  discountRate: number;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  availableDate: Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  expiredDate: Date;
}
