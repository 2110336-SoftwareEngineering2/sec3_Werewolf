import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JobModule } from '../job/job.module';
import { UsersModule } from '../users/users.module';
import { RefundController } from './refund.controller';
import { RefundProviders } from './refund.providers';
import { RefundService } from './refund.service';

@Module({
  imports: [DatabaseModule, JobModule, UsersModule],
  controllers: [RefundController],
  providers: [RefundService, ...RefundProviders],
})
export class RefundModule {}
