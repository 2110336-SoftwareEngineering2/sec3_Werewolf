import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../../job/work';

export class WorkDto {
  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  readonly work: [string];
}
