import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../workType';

export class UpdateMaidDto {
  @ApiProperty({ type: String })
  note: string;

  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  work: [string];
}
