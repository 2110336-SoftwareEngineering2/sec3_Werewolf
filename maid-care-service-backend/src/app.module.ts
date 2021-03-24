import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { MaidsModule } from './maids/maids.module';
import { UsersModule } from './users/users.module';
import { PromotionModule } from './promotion/promotion.module';
import { JobModule } from './job/job.module';
import { NotificationModule } from './notification/notification.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CustomerModule,
    UsersModule,
    MaidsModule,
    PromotionModule,
    JobModule,
    NotificationModule,
    WorkspacesModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
