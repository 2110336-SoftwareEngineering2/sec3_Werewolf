import {
  Body,
  Controller,
  Put,
  Get,
  Request,
  UseGuards,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JobDto } from '../job/dto/job.dto';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService, ReviewTest } from './review.service';
import { JobService } from '../job/job.service';

@Controller('review')
@ApiTags('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly reviewTest: ReviewTest,
    private readonly jobService: JobService,
  ) {}

  @Put()
  @ApiCreatedResponse({
    description:
      'This controller update STATES, rating, review of job and Update Maid rating',
    type: JobDto,
  })
  @ApiResponse({ status: 400, description: 'wrong Job Id, maid Id' })
  @ApiResponse({
    status: 404,
    description: 'job not found or already reviewed',
  })
  @ApiResponse({ status: 422, description: 'maid not match job owner' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async updateJobReview(
    @Request() req,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const isSameUser = await this.jobService.checkUserWithJob(
      updateReviewDto.jobId,
      req.user._id,
      updateReviewDto.maidId,
    );
    if (isSameUser) {
      await this.reviewService.updateMaidRating(
        updateReviewDto.maidId,
        updateReviewDto.rating,
      );
      const reviewedJob = await this.reviewService.updateJobReview(
        updateReviewDto,
      );
      return new JobDto(reviewedJob);
    } else {
      throw new UnprocessableEntityException('maid not match job owner');
    }
  }

  @Get('/test')
  @ApiCreatedResponse({ description: 'test', type: JobDto })
  async testupdateJobReviewd() {
    const job = await this.reviewTest.testReview();
    return job;
  }
}
