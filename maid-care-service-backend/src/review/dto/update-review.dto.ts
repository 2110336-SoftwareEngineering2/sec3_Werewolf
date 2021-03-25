import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './review.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @ApiProperty({ type: String })
    readonly jobId: string;

    @ApiProperty({ type: String })
    readonly maidId: string;
}