import {
    Injectable,
    Inject,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
import { Job } from 'src/job/interfaces/job.interface';
import { JobService } from '../job/job.service';
import { CreateReviewDto } from './dto/review.dto';
import { UpdateReviewDto} from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        private jobService : JobService,
    ) {}

    async updateJobReview(updateJobReview : UpdateReviewDto): Promise<Job>{
        const job = await this.jobService.findJob(updateJobReview.jobId);
        job.review = updateJobReview.reviewDescription;
        job.rating = updateJobReview.rating;
        const jobSaved = this.jobService.jobReviewd(job);
        return await jobSaved;
    }

    async checkUserWithJob(jobId: string, customerId: string ): Promise<Boolean>{
        const job = await this.jobService.findJob(jobId);
        return job.customerId == customerId;
    }
}
