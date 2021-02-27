import * as mongoose from 'mongoose';

export const MaidSchema = new mongoose.Schema({
  work: { type: [String], default: [] },
  avgRating: { type: Number, default: null },
  totalReviews: { type: Number, default: 0 },
  availability: { type: Boolean, default: false },
});
