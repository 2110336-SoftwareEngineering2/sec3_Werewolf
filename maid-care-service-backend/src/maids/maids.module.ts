import { Module } from '@nestjs/common';
import { MaidsController } from './maids.controller';
import { MaidsService } from './maids.service';
import { MaidsProviders } from './maids.providers';
import { DatabaseModule } from '../database/database.module';
import { JobModule } from '../job/job.module';

@Module({
  imports: [DatabaseModule, JobModule],
  controllers: [MaidsController],
  providers: [MaidsService, ...MaidsProviders],
  exports: [MaidsService],
})
export class MaidsModule {}
