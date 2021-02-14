import * as mongoose from 'mongoose';

export const PromotionSchema = new mongoose.Schema({
  creater: String,
  description: String,
  availableDate: {type: Date, default: Date.now},
  expiredDate: Date
});