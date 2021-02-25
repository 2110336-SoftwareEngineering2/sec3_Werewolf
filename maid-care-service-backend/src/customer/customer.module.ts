import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerProviders } from './customer.providers';
import { DatabaseModule } from '../database/database.module';
import { JobModule } from '../job/job.module';

@Module({
  imports: [DatabaseModule, JobModule],
  controllers: [CustomerController],
  providers: [CustomerService, ...CustomerProviders],
  exports: [CustomerService],
})
export class CustomerModule {}