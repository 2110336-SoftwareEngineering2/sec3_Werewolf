import { Connection } from 'mongoose';
import { JobSchema } from './schemas/job.schema';

export const JobProviders = [
  {
    provide: 'JOB_MODEL',
    useFactory: (connection: Connection) => connection.model('job', JobSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
