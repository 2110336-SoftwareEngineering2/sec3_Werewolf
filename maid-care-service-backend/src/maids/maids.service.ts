import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Maid } from './interfaces/maids.interface';

@Injectable()
export class MaidsService {
  constructor(@Inject('MAID_MODEL') private maidModel: Model<Maid>) {}

  async findMaid(id: string): Promise<Maid> {
    return this.maidModel.findOne({ _id: id }).exec();
  }

  async createNewMaid(id: string): Promise<Maid> {
    const maidRegistered = await this.findMaid(id);
    if (!maidRegistered) {
      const newMaid = { _id: id };
      const createdMaid = new this.maidModel(newMaid);
      return await createdMaid.save();
    }
    return maidRegistered;
  }
}
