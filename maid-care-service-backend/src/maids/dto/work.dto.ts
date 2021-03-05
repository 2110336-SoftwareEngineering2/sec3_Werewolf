import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../workType';

export class WorkDto {
  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  readonly work: [string];
}
