import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceProviders } from './workspaces.providers';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService, ...WorkspaceProviders]
})
export class WorkspacesModule {}
