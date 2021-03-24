import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletProviders } from './wallet.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [WalletService, ...WalletProviders],
  exports: [WalletService],
})
export class WalletModule {}
