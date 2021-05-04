import { Connection } from 'mongoose';
import { EmailVerificationSchema } from './schemas/emailverification.schema';

export const EmailVerificationProviders = [
  {
    provide: 'EmailVerification_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('emailVerification', EmailVerificationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
