import { Document } from 'mongoose';

export interface Workspace extends Document {
  customerId: string;
  description: string;
  latitude: number;
  longitude: number;
}
