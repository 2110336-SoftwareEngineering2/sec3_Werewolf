import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly jobId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly description: string;
}
