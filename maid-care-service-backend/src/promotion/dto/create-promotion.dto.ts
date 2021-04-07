import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
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
