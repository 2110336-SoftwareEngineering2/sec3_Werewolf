import { Body, Controller, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiCreatedResponse,
    ApiResponse,
  } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { CreateReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
@ApiTags('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ){}

    @Put()
    @ApiCreatedResponse({description: 'This controller update STATES, rating, review of job', type: CreateReviewDto})
    @ApiResponse({ status: 400, description: 'wrong JobId' })
    @ApiResponse({
    status: 401,
    description: 'user not match job owner',
  })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('acess-token')
    async updateJobReviewd(@Request() req, @Body() updateReviewDto: UpdateReviewDto){
        const isSameCustomer = this.reviewService.checkUserWithJob(updateReviewDto.jobId, req.user._id);
        if (isSameCustomer){
            return await this.reviewService.updateJobReview(updateReviewDto);
        } else{
            throw new UnauthorizedException('user not match job owner');
        }
    }

    

}
