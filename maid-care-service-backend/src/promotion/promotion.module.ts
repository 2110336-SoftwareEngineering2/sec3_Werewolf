import { Module } from '@nestjs/common';
import { PromotionController } from './promotion.controller';
import { PromotionProviders } from './promotion.providers';
import { PromotionService } from './promotion.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PromotionController],
  providers: [
    PromotionService,
    ...PromotionProviders
  ],
  exports: [PromotionService]
})
export class PromotionModule {}
