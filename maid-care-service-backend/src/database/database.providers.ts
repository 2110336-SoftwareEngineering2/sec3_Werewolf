import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://' + (process.env.DB_USERNAME?(process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@'):'') 
        + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DATABASE + '?authSource=' + process.env.DB_AUTHSOURCE, 
        {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  },
];