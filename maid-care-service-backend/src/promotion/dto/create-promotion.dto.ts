import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  constructor(object: any) {
    this.code = object.code;
    this.description = object.description;
    this.discountRate = object.discountRate;
    this.availableDate = object.availableDate;
    this.expiredDate = object.expiredDate;
  }

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
