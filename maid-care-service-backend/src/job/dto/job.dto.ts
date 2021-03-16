import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from 'src/maids/workType';

export class JobDto {
  constructor(object: any) {
    this._id = object._id;
    this.workplaceId = object.workplaceId;
    this.work = object.work;
    this.cost = object.cost;
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
  readonly workplaceId: string;

  @ApiProperty({ type: () => [Work] })
  readonly work: [Work];

  @ApiProperty({ type: Number })
  readonly cost: number;

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

export class Work {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ type: String })
  unit: string;
}
