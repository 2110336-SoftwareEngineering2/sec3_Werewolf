import * as mongoose from 'mongoose';

export const WorkspaceSchema = new mongoose.Schema({
    userId: String,
    description: String,
    latitude: {type: Number, default: null},
    longitude: {type: Number, default: null}       
})