import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  birthdate: Date,
  citizenId: String,
  bankAccountNumber: String,
  profilePicture: { type: String, default: null },
  role: String,
  valid: { type: Boolean, default: false },
});
