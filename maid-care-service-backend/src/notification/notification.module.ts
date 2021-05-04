import { Module } from '@nestjs/common';
import { SubscriptionProviders } from './subscription.providers';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '../database/database.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [DatabaseModule],
  providers: [NotificationService, ...SubscriptionProviders],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
