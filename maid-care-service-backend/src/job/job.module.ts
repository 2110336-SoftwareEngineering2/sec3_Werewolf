import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobProviders } from './job.providers';
import { JobService } from './job.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [JobController],
  providers: [JobService, ...JobProviders],
  exports: [JobService],
})
export class JobModule {}
