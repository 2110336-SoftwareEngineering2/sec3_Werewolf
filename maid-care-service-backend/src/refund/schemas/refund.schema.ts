import * as mongoose from 'mongoose';

export const RefundSchema = new mongoose.Schema({
  customerId: String,
  jobId: String,
  description: String,
  photo: [String],
  createDate: { type: Date, default: Date.now },
});
