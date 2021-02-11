import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    ...UsersProviders,
  ],
  exports: [UsersService],
})
export class UsersModule {}