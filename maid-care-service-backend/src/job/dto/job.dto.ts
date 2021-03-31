import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../../maids/workType';
import { JobState } from '../jobState';

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
    this.photos = object.photos;
    this.acceptedTime = object.acceptedTime;
    this.finishTime = object.finishTime;
  }

  @ApiProperty({ type: String })
  readonly _id: string;

  @ApiProperty({ type: String })
  readonly workplaceId: string;

  @ApiProperty({ type: () => [Work] })
  readonly work: Work[];

  @ApiProperty({ type: Number })
  cost: number;

  @ApiProperty({ type: String })
  readonly customerId: string;

  @ApiProperty({ type: String })
  readonly maidId: string;

  @ApiProperty({ type: Date })
  readonly expiryTime: Date;

  @ApiProperty({ enum: Object.values(JobState) })
  readonly state: string;

  @ApiProperty({ type: Number })
  readonly rating: number;

  @ApiProperty({ type: String })
  readonly review: string;

  @ApiProperty({ type: [String] })
  readonly photos: string[];

  @ApiProperty({ type: Date })
  readonly acceptedTime: Date;

  @ApiProperty({ type: Date })
  readonly finishTime: Date;
}

export class Work {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ enum: ['ตารางเมตร', 'จาน', 'ตัว'] })
  unit: string;

  @ApiProperty({ type: Number })
  cost: number;
}
