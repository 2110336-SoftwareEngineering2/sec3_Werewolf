import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  @IsString({ each: true })
  work: string[];
}
