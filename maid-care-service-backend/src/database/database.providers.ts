import * as mongoose from 'mongoose';
import {default as config} from '../config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://' + (config.db.user?(config.db.user + ':' + config.db.pass + '@'):'') 
        + config.db.host + ':' + config.db.port + '/' + config.db.database + '?authSource=' + config.db.authSource, 
        {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }),
  },
];