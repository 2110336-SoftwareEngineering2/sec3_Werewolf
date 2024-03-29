import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './interfaces/workspaces.interface';

@Injectable()
export class WorkspacesService {
  constructor(
    @Inject('WORKSPACE_MODEL') private workspaceModel: Model<Workspace>,
  ) {}

  async addNewWorkspace(newWorkspace: CreateWorkspaceDto): Promise<Workspace> {
    const newWorkspaceRegister = await this.findExist(
      newWorkspace.customerId,
      newWorkspace.latitude,
      newWorkspace.longitude,
    );
    if (!newWorkspaceRegister) {
      //if workspace does not exist, create new one.
      const workspaceRegistered = new this.workspaceModel(newWorkspace);
      return workspaceRegistered.save();
    } else {
      throw new ConflictException(
        'Workspace of this Customer is already exist!',
      );
      //throw new ConflictException(newWorkspaceRegister);
    }
  }

  async findAllWorkspaceByCustomerId(customerId: string): Promise<Workspace[]> {
    //
    if (String(customerId).length === 24) {
      return await this.workspaceModel.find({ customerId: customerId }).exec();
    } else return null;
  }

  async findExist(
    customerId: string,
    latitude: number,
    longitude: number,
  ): Promise<Workspace> {
    return await this.workspaceModel
      .findOne({
        customerId: customerId,
        latitude: latitude,
        longitude: longitude,
      })
      .exec();
  }

  async findOne(_id: string): Promise<Workspace> {
    //find by workspace object id
    if (String(_id).length === 24) {
      return this.workspaceModel.findById(_id).exec();
    } else return null;
  }

  async removeWorkspace(_id: string): Promise<Workspace> {
    const targetWorkspace = await this.findOne(_id);
    //if targetWorkspace exist then remove targetWorkspace.
    if (!targetWorkspace)
      throw new NotFoundException("This workspace doesn't exist!");
    return await targetWorkspace.remove();
  }
}
