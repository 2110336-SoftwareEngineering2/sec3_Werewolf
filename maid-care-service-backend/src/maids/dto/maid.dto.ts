import { ApiProperty } from '@nestjs/swagger';
import { UpdateMaidDto } from './update-maid.dto';

export class MaidDto extends UpdateMaidDto {
  constructor(object: any) {
    super();
    this._id = object._id;
    this.availability = object.availability;
    this.avgRating = object.avgRating;
    this.totalReviews = object.totalReviews;
    this.note = object.note;
    this.work = object.work;
  }

  @ApiProperty({ type: String })
  readonly _id: string;

  @ApiProperty({ type: Boolean })
  readonly availability: boolean;

  @ApiProperty({ type: Number })
  readonly avgRating: number;

  @ApiProperty({ type: Number })
  readonly totalReviews: number;
}
