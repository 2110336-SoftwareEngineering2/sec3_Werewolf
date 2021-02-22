import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Maid } from './interfaces/maids.interface';

@Injectable()
export class MaidsService {
  constructor(@Inject('MAID_MODEL') private maidModel: Model<Maid>) {}

  async findMaid(email: string): Promise<Maid> {
    return this.maidModel.findOne({ email: email }).exec();
  }

  async createNewMaid(email: string): Promise<Maid> {
    const maidRegistered = await this.findMaid(email);
    if (!maidRegistered) {
      const newMaid = { email: email };
      const createdMaid = new this.maidModel(newMaid);
      return await createdMaid.save();
    }
    return maidRegistered;
  }
}
