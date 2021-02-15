import { Connection } from 'mongoose';
import { MaidSchema } from './schemas/maids.schema';

export const MaidsProviders = [
  {
    provide: 'MAID_MODEL',
    useFactory: (connection: Connection) => connection.model('maids', MaidSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];