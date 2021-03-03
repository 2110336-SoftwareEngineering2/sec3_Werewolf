import { Document } from 'mongoose';

export interface Maid extends Document {
  work: [string];
  cerrentLocation: {
    latitude: number;
    longitude: number;
  };
  availability: boolean;
  avgRating: number;
  totalReviews: number;
}
