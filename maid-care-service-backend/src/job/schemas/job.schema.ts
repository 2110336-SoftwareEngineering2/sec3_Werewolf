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
      cost: { type: Number, default: 0 },
    },
  ],
  maidId: { type: String, default: null },
  cost: { type: Number, default: 0 },
  requestedMaid: [String],
  expiryTime: { type: Date, default: null },
  state: { type: String, default: JobState.creating },
  rating: { type: Number, default: 0 },
  review: { type: String, default: null },
  photos: [String],
});
