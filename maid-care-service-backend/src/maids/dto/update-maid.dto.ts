import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { WorkType } from '../workType';

export class UpdateMaidDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  note: string;

  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  @IsArray()
  work: [string];
}
