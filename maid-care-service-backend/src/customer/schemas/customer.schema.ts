import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
  g_coin: { type: Number, default: 0 },
});
