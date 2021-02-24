import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';
import { CustomerModule } from '../customer/customer.module';
import { MaidsModule } from '../maids/maids.module';

@Module({
  imports: [DatabaseModule, CustomerModule, MaidsModule],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
})
export class UsersModule {}
