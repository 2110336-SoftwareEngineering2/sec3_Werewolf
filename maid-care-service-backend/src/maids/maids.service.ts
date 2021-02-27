import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Maid } from './interfaces/maids.interface';
import { JobService } from '../job/job.service';

@Injectable()
export class MaidsService {
  constructor(
    @Inject('MAID_MODEL') private maidModel: Model<Maid>,
    private jobService: JobService,
  ) {}

  async findMaid(id: string): Promise<Maid> {
    if (String(id).length === 24) {
      return this.maidModel.findOne({ _id: id }).exec();
    } else return null;
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

  async updateWork(id: string, work: [string]): Promise<Maid> {
    // validate works
    if (!work) throw new BadRequestException('no work');
    work.forEach((work) => {
      if (!this.jobService.isValidTypeOfWork(work))
        throw new BadRequestException(work + ' is not valid type of work');
    });
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new ForbiddenException('Invalid maid');
    // update works
    maidFromDb.work = work;
    await maidFromDb.save();
    return maidFromDb;
  }

  async setAvailability(id: string, availability: boolean): Promise<Maid> {
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new ForbiddenException('Invalid maid');
    maidFromDb.availability = availability;
    await maidFromDb.save();
    return maidFromDb;
  }
}
