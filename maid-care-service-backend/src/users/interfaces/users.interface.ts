import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  valid: boolean;
}
