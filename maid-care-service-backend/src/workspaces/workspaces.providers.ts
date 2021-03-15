import { Connection } from 'mongoose';
import {WorkspaceSchema} from './schemas/workspaces.schema';

export const WorkspaceProviders = [
  {
    provide: 'WORKSPACE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('workspace', WorkspaceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
