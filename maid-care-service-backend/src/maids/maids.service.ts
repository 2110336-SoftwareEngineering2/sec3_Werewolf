import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Job } from '../job/interfaces/job.interface';
import { Maid } from './interfaces/maids.interface';
import { WorkType } from './workType';

@Injectable()
export class MaidsService {
  constructor(@Inject('MAID_MODEL') private maidModel: Model<Maid>) {}

  async findMaid(id: string): Promise<Maid> {
    if (String(id).length === 24) {
      return this.maidModel.findOne({ _id: id }).exec();
    } else return null;
  }

  async findAvailableMaid(): Promise<Maid[]> {
    return this.maidModel.find({ availability: true }).exec();
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
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new NotFoundException('invalid maid');
    // update works
    if (work) {
      work.forEach((work) => {
        if (!this.isValidTypeOfWork(work))
          throw new BadRequestException(work + ' is not valid type of work');
      });
      maidFromDb.work = work;
      await maidFromDb.save();
    }
    return maidFromDb;
  }

  async updateNote(id: string, note: string): Promise<Maid> {
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new NotFoundException('invalid maid');
    // update note
    if (note) {
      maidFromDb.note = note;
      await maidFromDb.save();
    }
    return maidFromDb;
  }

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<Maid> {
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new NotFoundException('invalid maid');
    // update latitude and Longitude
    maidFromDb.cerrentLocation.latitude = latitude;
    maidFromDb.cerrentLocation.longitude = longitude;
    await maidFromDb.save();
    return maidFromDb;
  }

  async setAvailability(id: string, availability: boolean): Promise<Maid> {
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new NotFoundException('Invalid maid');
    maidFromDb.availability = availability;
    await maidFromDb.save();
    return maidFromDb;
  }

  async findNearestMaid(
    latitude: number,
    longitude: number,
    job: Job,
  ): Promise<Maid> {
    const maids = await this.findAvailableMaid();
    if (!maids) return null;
    let nearestMaid;
    let minDistance = 99999;
    maids.forEach((maid) => {
      // check maid's cerrentLocation
      if (
        maid.cerrentLocation.latitude === null ||
        maid.cerrentLocation.longitude === null
      )
        return;
      // check maid've already rejected
      if (job.requestedMaid.includes(maid._id)) return;
      // check maid's type of work
      let canDoWork = true;
      job.work.forEach((work) => {
        if (!maid.work.includes(work.typeOfWork)) canDoWork = false;
      });
      if (!canDoWork) return;
      // check distance
      const distance = this.findDistance(
        latitude,
        longitude,
        maid.cerrentLocation.latitude,
        maid.cerrentLocation.longitude,
      );
      if (distance < minDistance) {
        nearestMaid = maid;
        minDistance = distance;
      }
    });
    return nearestMaid;
  }

  findDistance(x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
  }

  isValidTypeOfWork(workType: string) {
    return (<any>Object).values(WorkType).includes(workType);
  }
}
