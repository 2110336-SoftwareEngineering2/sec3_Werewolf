import { Connection } from 'mongoose';
import { PromotionSchema } from './schemas/promotion.schema';

export const PromotionProviders = [
  {
    provide: 'PROMOTION_MODEL',
    useFactory: (connection: Connection) => connection.model('promotion', PromotionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];