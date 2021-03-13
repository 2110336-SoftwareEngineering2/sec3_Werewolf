import { 
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './interfaces/workspaces.interface';


@Injectable()
export class WorkspacesService {
  constructor(@Inject('WORKSPACE_MODEL') private workspaceModel: Model<Workspace>) {}

  async addNewWorkspace(newWorkspace: CreateWorkspaceDto): Promise<Workspace> {
    const newWorkspaceRegister = await this.findExist(newWorkspace.userId, newWorkspace.description);
    if (!newWorkspaceRegister) {
      //if workspace does not exist, create new one.
      const workspaceRegistered = new this.workspaceModel(newWorkspace);
      return workspaceRegistered.save();
    } else {
      throw new ConflictException('Workspace of this Customer is already exist!');
    }
  }

  findAllWorkspaceByUserId(userid: string) : Promise<Workspace[]> {
    //userid is the user id in the User class
    if (String(userid).length === 24) {
      return this.workspaceModel.find({ userid: userid }).exec();
    } else return null;
  }

  async findExist(userId: string, description: string): Promise<Workspace> {
    return this.workspaceModel.findOne({userId: userId, description: description}).exec();
  }

  async findOne(_id: string) : Promise<Workspace> {
    //find by workspace object id
    return this.workspaceModel.findById(_id).exec();
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
