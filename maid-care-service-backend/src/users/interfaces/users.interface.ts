import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  citizenId: string;
  bankAccountNumber: string;
  role: string;
  valid: boolean;
}
