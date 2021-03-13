import {Document} from 'mongoose';

export interface Workspace extends Document{
    userId: string;
    description: string;
    latitude: number;
    longitude: number;
}