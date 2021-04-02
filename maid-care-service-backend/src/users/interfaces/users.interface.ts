import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  citizenId: string;
  bankAccountNumber: string;
  profilePicture: string;
  role: string;
  valid: boolean;
}
