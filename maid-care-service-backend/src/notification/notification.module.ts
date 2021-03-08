import { Module } from '@nestjs/common';
import { SubscriptionProviders } from './subscription.providers';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NotificationService, ...SubscriptionProviders],
  exports: [NotificationService],
})
export class NotificationModule {}
