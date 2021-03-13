import * as mongoose from 'mongoose';

export const WorkspaceSchema = new mongoose.Schema({
    userId: String,
    workspace: {
        description: String,
        location: {
            latitude: {type: Number, default: null},
            longitude: {type: Number, default: null}
        }
    }
})