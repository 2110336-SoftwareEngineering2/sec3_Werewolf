import { Document } from 'mongoose';

export interface Workspace extends Document {
  _id: string;
  customerId: string;
  description: string;
  latitude: number;
  longitude: number;
}
