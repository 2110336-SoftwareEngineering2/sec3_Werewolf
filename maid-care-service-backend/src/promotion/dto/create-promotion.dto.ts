import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsDateString, IsOptional } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  @IsNumberString()
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
