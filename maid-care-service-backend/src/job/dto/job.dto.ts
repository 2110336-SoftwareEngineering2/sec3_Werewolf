import { ApiProperty } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

export class JobDto extends CreateJobDto {
  constructor(object: any) {
    super(object);
    this._id = object._id;
    this.customerId = object.customerId;
    this.maidId = object.maidId;
    this.expiryTime = object.expiryTime;
    this.state = object.state;
    this.rating = object.rating;
    this.review = object.review;
  }

  @ApiProperty({ type: String })
  readonly _id: string;

  @ApiProperty({ type: String })
  readonly customerId: string;

  @ApiProperty({ type: String })
  readonly maidId: string;

  @ApiProperty({ type: Date })
  readonly expiryTime: Date;

  @ApiProperty({ type: String })
  readonly state: string;

  @ApiProperty({ type: Number })
  readonly rating: number;

  @ApiProperty({ type: String })
  readonly review: string;
}
