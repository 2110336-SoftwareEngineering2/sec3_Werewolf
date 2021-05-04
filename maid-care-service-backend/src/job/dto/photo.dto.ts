import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PhotoDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly jobId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly url: string;
}
