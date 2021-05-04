import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { WalletModule } from '../wallet/wallet.module';
import { JobModule } from '../job/job.module';

@Module({
  imports: [WalletModule, JobModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
