import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';
import { NotificationModule } from '../notification/notification.module';
import { WalletModule } from '../wallet/wallet.module';
import { MaidsModule } from '../maids/maids.module';
import { JobModule } from '../job/job.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationModule,
    WalletModule,
    MaidsModule,
    JobModule,
    WorkspacesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
})
export class UsersModule {}
