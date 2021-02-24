import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ type: String })
  readonly workplaceId: string;

  @ApiProperty({ type: () => [Work] })
  readonly work: [Work];
}

class Work {
  @ApiProperty({ enum: ['washing_dish', 'cleaning_room', 'ironing'] })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;
}
