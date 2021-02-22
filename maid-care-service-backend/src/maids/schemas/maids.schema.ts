import * as mongoose from 'mongoose';

export const MaidSchema = new mongoose.Schema({
  avgRating: { type: Number, default: null },
  totalReviews: { type: Number, default: 0 },
});
