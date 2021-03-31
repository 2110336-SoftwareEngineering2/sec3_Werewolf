import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly jobId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  readonly photo: string[];
}
