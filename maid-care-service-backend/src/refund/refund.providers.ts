import { Connection } from 'mongoose';
import { RefundSchema } from './schemas/refund.schema';

export const RefundProviders = [
  {
    provide: 'REFUND_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('refund', RefundSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
