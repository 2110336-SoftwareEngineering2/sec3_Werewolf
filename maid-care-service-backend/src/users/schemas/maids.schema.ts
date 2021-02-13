import * as mongoose from 'mongoose';

export const MaidSchema = new mongoose.Schema({
  email: String,
  avgRating : Number,
  totalReviews : { type: Number, default: 0 }
});