import * as mongoose from 'mongoose';

export const MaidSchema = new mongoose.Schema({
  email: String,
  avgRating: { type: Number, default: null },
  totalReviews: { type: Number, default: 0 },
});
