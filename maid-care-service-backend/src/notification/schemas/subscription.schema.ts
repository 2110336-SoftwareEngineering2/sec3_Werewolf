import * as mongoose from 'mongoose';

export const SubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  expirationTime: Number,
  keys: {
    auth: String,
    p256dh: String,
  },
});
