import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MaidsModule } from './maids/maids.module';
import { UsersModule } from './users/users.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, UsersModule, MaidsModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
