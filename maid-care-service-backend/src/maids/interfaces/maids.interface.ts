import { Document } from 'mongoose';

export interface Maid extends Document {
  email: string;
  avgRating: Number;
  totalReviews: Number;
}
