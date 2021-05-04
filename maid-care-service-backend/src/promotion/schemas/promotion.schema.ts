import * as mongoose from 'mongoose';

export const PromotionSchema = new mongoose.Schema({
  code: String,
  creater: String,
  description: { type: String, default: '' },
  discountRate: Number,
  availableDate: { type: Date, default: Date.now },
  expiredDate: { type: Date, default: null },
});
