import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ type: String })
  readonly workplaceId: string;
}
