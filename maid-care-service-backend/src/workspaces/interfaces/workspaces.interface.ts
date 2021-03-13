import {Document} from 'mongoose';

export interface Workspace extends Document{
    userId: string;
    workspace: {
        description: string;
        location: {
            latitude: number;
            longitude: number;
        };
    };
}