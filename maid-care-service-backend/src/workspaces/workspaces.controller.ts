import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceDto } from './dto/workspace.dto';

@Controller('workspaces')
@ApiTags('workspace')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Add Workspace',
    type: WorkspaceDto,
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    try {
      const workspace = await this.workspacesService.addNewWorkspace(
        createWorkspaceDto,
      );
      return new WorkspaceDto(workspace);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Get All Workspace By CustomerId from Request',
    type: [WorkspaceDto],
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async findAllWorkspace(@Request() req) {
    try {
      const customerId = req.user._id;
      return await this.workspacesService.findAllWorkspaceByCustomerId(
        customerId,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: 'Get workspace by workspace id',
    type: WorkspaceDto,
  })
  async findWorkspacebyWorkspaceId(@Param('id') id: string) {
    const foundWorkspace = await this.workspacesService.findOne(id);
    if (!foundWorkspace) throw new NotFoundException('invalid id');
    return new WorkspaceDto(foundWorkspace);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Delete Workspace By Workspace Id',
    type: WorkspaceDto,
  })
  @ApiResponse({ status: 401, description: 'user is not customer or admin' })
  @ApiResponse({
    status: 404,
    description: 'workspace not found or it is not your workspace',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiBearerAuth('acess-token')
  async removeWorkspaceByWorkspaceId(@Request() req, @Param('id') id: string) {
    //Delete by workspaceId
    try {
      const requestCustomerId = req.user._id;
      const targetWorkspace = await this.workspacesService.findOne(id);
      if (
        req.user.role === 'admin' ||
        (targetWorkspace && requestCustomerId == targetWorkspace.customerId)
      ) {
        const result = await this.workspacesService.removeWorkspace(id);
        return new WorkspaceDto(result);
      } else throw new NotFoundException("This workspace doesn't exist!");
    } catch (error) {
      throw error;
    }
  }
}
