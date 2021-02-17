import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
  email: String,
  g_coin: { type: Number, default: 0 },
});
