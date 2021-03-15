import { ApiProperty } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';

export class PromotionDto extends CreatePromotionDto {
  constructor(object: any) {
    super(object);
    this.creater = object.creater;
  }

  @ApiProperty({ type: String })
  readonly creater: string;
}
