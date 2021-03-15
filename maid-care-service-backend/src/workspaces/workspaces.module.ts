import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceProviders } from './workspaces.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, ...WorkspaceProviders]
})
export class WorkspacesModule {}
