import * as mongoose from 'mongoose';

export const WalletSchema = new mongoose.Schema({
  g_coin: { type: Number, default: 0 },
});
