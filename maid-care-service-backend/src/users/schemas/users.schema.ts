import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  birthdate: Date,
  citizenId: String,
  nationality: String,
  bankAccountNumber: String,
  phone: String,
  role: String,
  valid: { type: Boolean, default: false },
});
