import * as mongoose from 'mongoose';

export const WorkspaceSchema = new mongoose.Schema({
    customerId: String,
    description: String,
    latitude: Number,
    longitude: Number       
})