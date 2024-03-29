import { Connection } from 'mongoose';
import { WalletSchema } from './schemas/wallet.schema';

export const WalletProviders = [
  {
    provide: 'WALLET_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('wallet', WalletSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
