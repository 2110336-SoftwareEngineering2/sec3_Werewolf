import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://admin:password@mongodb:27017/maid_care_service_database?authSource=admin', 
        {useNewUrlParser: true, useUnifiedTopology: true})
      //mongoose.connect('mongodb://localhost:27017/maid_care_service_database', {useNewUrlParser: true, useUnifiedTopology: true}),
  },
];