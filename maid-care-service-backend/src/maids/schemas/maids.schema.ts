import * as mongoose from 'mongoose';

export const MaidSchema = new mongoose.Schema({
  work: { type: [String], default: [] },
  cerrentLocation: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  availability: { type: Boolean, default: false },
  avgRating: { type: Number, default: null },
  totalReviews: { type: Number, default: 0 },
});
