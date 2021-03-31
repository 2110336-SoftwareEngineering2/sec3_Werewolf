import { ApiProperty } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';

export class PromotionDto extends CreatePromotionDto {
  constructor(object: any) {
    super();
    this.creater = object.creater;
    this.code = object.code;
    this.description = object.description;
    this.discountRate = object.discountRate;
    this.availableDate = object.availableDate;
    this.expiredDate = object.expiredDate;
  }

  @ApiProperty({ type: String })
  creater: string;
}
