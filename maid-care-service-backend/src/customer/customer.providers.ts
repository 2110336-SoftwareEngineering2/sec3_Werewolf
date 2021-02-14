import { Connection } from 'mongoose';
import { CustomerSchema } from './schemas/customer.schema';

export const CustomerProviders = [
  {
    provide: 'CUSTOMER_MODEL',
    useFactory: (connection: Connection) => connection.model('customer', CustomerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];