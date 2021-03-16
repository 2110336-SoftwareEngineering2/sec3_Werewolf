import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
  customerId: String,
  workplaceId: String,
  work: [{ typeOfWork: String, description: String, quantity: Number }],
  maidId: { type: String, default: null },
  requestedMaid: [String],
  expiryTime: Date,
  state: { type: String, default: 'posted' },
  rating: { type: Number, default: 0 },
  review: { type: String, default: null },
});
