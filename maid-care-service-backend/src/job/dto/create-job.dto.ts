import { ApiProperty } from '@nestjs/swagger';
import { Work } from '../work';

export class CreateJobDto {
  @ApiProperty({ type: String })
  readonly workplaceId: string;

  @ApiProperty({ type: () => [Work] })
  readonly work: [Work];
}
