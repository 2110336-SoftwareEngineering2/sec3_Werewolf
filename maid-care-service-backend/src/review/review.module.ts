import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { JobModule } from '../job/job.module';
import { MaidsModule } from '../maids/maids.module';
import { ReviewController } from './review.controller';
import { ReviewService, ReviewTest } from './review.service';

@Module({
  imports: [JobModule, MaidsModule, UsersModule, WorkspacesModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewTest],
})
export class ReviewModule {}
