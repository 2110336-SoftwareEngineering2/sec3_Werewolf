import { Module } from '@nestjs/common';
import { JobModule } from '../job/job.module';
import { MaidsModule } from '../maids/maids.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [JobModule, MaidsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
