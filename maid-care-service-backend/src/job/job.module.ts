import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobProviders } from './job.providers';
import { JobService } from './job.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';
import { NotificationModule } from '../notification/notification.module';
import { MaidsModule } from '../maids/maids.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { PromotionModule } from '../promotion/promotion.module';
import { WalletModule } from '../wallet/wallet.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationModule,
    MaidsModule,
    WorkspacesModule,
    PromotionModule,
    WalletModule,
    ReviewModule,
  ],
  controllers: [JobController],
  providers: [JobService, SchedulerRegistry, ...JobProviders],
  exports: [JobService],
})
export class JobModule {}
