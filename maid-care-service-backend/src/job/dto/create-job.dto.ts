import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { WorkType } from '../../maids/workType';

export class CreateJobDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly workplaceId: string;

  @ApiProperty({ type: () => [CreateWork] })
  @IsArray()
  readonly work: [CreateWork];

  @ApiProperty({ type: String })
  readonly promotionCode: string;
}

class CreateWork {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;
}
