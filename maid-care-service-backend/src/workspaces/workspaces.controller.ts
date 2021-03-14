import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';


@Controller('workspaces')
@ApiTags('workspace')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createWorkspace(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    try {
      await this.workspacesService.addNewWorkspace(createWorkspaceDto);
    }
    catch (error){
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async findAllWorkspace(@Request() req) {
    try {
      const customerId = req.user._id;
      return await this.workspacesService.findAllWorkspaceByCustomerId(customerId);
    }
    catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: 'Get workspace by workspace id'
  })
  async findWorkspacebyWorkspaceId(@Param('id') id: string) {
    const foundWorkspace = await this.workspacesService.findOne(id);
    if (!foundWorkspace) throw new NotFoundException('invalid id');
    const result = {
      customerId: foundWorkspace.customerId,
      description: foundWorkspace.description,
      latitude: foundWorkspace.latitude,
      longitude: foundWorkspace.longitude 
    };
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async removeWorkspaceByWorkspaceId(@Request() req, @Param('id') id: string) {
    //Delete by workspaceId
    try {
      const requestCustomerId = req.user._id;
      const targetWorkspace = await this.workspacesService.findOne(id);
      if (requestCustomerId == targetWorkspace.customerId){
        const result = await this.workspacesService.removeWorkspace(id);
        return result
      }
    }
    catch (error) {
      throw error;
    }
  }
}
