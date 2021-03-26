import { Document } from 'mongoose';

export interface Maid extends Document {
  _id: string;
  note: string;
  work: [string];
  cerrentLocation: {
    latitude: number;
    longitude: number;
  };
  availability: boolean;
  avgRating: number;
  totalReviews: number;
}
