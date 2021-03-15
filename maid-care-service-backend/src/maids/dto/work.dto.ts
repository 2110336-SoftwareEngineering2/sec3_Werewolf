import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../workType';

export class WorkDto {
  constructor(object: any) {
    this.work = object.work;
  }

  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  readonly work: [string];
}
