import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../workType';

export class UpdateMaidDto {
  constructor(object: any) {
    this.note = object.note;
    this.work = object.work;
  }

  @ApiProperty({ type: String })
  readonly note: string;

  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  readonly work: [string];
}
