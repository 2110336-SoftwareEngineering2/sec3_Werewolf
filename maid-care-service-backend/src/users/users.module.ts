import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MaidsProviders } from './maids.providers';
import { UsersProviders } from './users.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...MaidsProviders,
    ...UsersProviders
  ],
  exports: [UsersService]
})
export class UsersModule {}