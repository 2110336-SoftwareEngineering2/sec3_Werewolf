import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ type: Number })
  readonly rating: number;

  @ApiProperty({ type: String })
  readonly reviewDescription: string;
}
