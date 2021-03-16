import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../../maids/workType';

export class CreateJobDto {
  constructor(object: any) {
    this.workplaceId = object.workplaceId;
    this.work = object.work;
  }

  @ApiProperty({ type: String })
  readonly workplaceId: string;

  @ApiProperty({ type: () => [Work] })
  readonly work: [Work];
}

export class Work {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;
}
