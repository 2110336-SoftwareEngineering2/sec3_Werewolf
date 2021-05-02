import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @Min(0)
  @Max(5)
  readonly rating: number;

  @ApiProperty({ type: String })
  @IsString()
  readonly reviewDescription: string;
}
