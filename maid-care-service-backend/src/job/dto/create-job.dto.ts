import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../../maids/workType';

export class CreateJobDto {
  @ApiProperty({ type: String })
  readonly workplaceId: string;

  @ApiProperty({ type: () => [CreateWork] })
  readonly work: [CreateWork];
}

class CreateWork {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;
}
