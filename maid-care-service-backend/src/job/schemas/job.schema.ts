import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
  customerId: String,
  workplaceId: String,
  work: [{ typeOfWork: String, description: String, quantity: Number }],
  maidId: { type: String, default: null },
  requestedMaid: [String],
  expiryTime: Date,
});
