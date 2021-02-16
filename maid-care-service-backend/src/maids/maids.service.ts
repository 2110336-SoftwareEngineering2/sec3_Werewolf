import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Maid } from './interfaces/maids.interface';

@Injectable()
export class MaidsService {
  constructor(@Inject('MAID_MODEL') private maidModel: Model<Maid>) {}

  async findMaid(email: string): Promise<Maid> {
    return this.maidModel.findOne({email: email}).exec();
  }

  async createNewMaid(email: string): Promise<Maid> {
    let maidRegistered = await this.findMaid(email);
    if (!maidRegistered) {
      let newMaid = { email: email };
      let createdMaid = new this.maidModel(newMaid);
      return await createdMaid.save();
    }
    return maidRegistered;
  }
}