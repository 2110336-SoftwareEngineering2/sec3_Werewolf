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

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<Maid> {
    // validate latitude and Longitude
    if (isNaN(latitude) || isNaN(longitude))
      throw new BadRequestException('Invalid latitude or Longitude');
    const maidFromDb = await this.findMaid(id);
    if (!maidFromDb) throw new ForbiddenException('Invalid maid');
    // update latitude and Longitude
    maidFromDb.cerrentLocation.latitude = latitude;
    maidFromDb.cerrentLocation.longitude = longitude;
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

  async findNearestMaid(latitude: number, longitude: number): Promise<Maid> {
    // validate latitude and Longitude
    if (isNaN(latitude) || isNaN(longitude))
      throw new ForbiddenException('Invalid latitude or Longitude');
    const maids = await this.findAvailableMaid();
    if (!maids) return null;
    let nearestMaid;
    let minDistance = 99999;
    maids.forEach((maid) => {
      if (
        maid.cerrentLocation.latitude === null ||
        maid.cerrentLocation.longitude === null
      )
        return;
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
}
