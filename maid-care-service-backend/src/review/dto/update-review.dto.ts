import { CreateReviewDto } from './review.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateReviewDto extends CreateReviewDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly jobId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly maidId: string;
}
