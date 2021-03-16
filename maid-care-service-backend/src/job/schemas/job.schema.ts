import * as mongoose from 'mongoose';
import { JobState } from '../jobState';

export const JobSchema = new mongoose.Schema({
  customerId: String,
  workplaceId: String,
  work: [
    {
      typeOfWork: String,
      description: String,
      quantity: Number,
      unit: { type: String, default: null },
    },
  ],
  maidId: { type: String, default: null },
  requestedMaid: [String],
  expiryTime: Date,
  state: { type: String, default: JobState.posted },
  rating: { type: Number, default: 0 },
  review: { type: String, default: null },
});
