import * as mongoose from 'mongoose';

export const JobSchema = new mongoose.Schema({
  customerId: String,
  maidId: { type: String, default: null },
  workplaceId: String,
  work: [{ typeOfWork: String, description: String, quantity: Number }],
});
