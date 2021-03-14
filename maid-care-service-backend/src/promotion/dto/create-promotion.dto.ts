import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty({ type: String })
  readonly code: string;

  @ApiProperty({ type: String })
  readonly description: string;

  @ApiProperty({ type: Number })
  readonly discountRate: number;

  @ApiProperty({ type: Date })
  readonly availableDate: Date;

  @ApiProperty({ type: Date })
  readonly expiredDate: Date;
}
