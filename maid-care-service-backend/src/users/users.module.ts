import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';
import { NotificationModule } from '../notification/notification.module';
import { CustomerModule } from '../customer/customer.module';
import { MaidsModule } from '../maids/maids.module';
import { JobModule } from '../job/job.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationModule,
    CustomerModule,
    MaidsModule,
    JobModule,
    WorkspacesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
})
export class UsersModule {}
