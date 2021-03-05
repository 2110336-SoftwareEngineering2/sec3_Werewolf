import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { MaidsService } from '../maids/maids.service';
import { Job } from './interfaces/job.interface';
import { Maid } from 'src/maids/interfaces/maids.interface';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @Inject('JOB_MODEL') private jobModel: Model<Job>,
    private maidsService: MaidsService,
  ) {}

  async findJob(id: string): Promise<Job> {
    if (String(id).length === 24) {
      return this.jobModel.findOne({ _id: id }).exec();
    } else return null;
  }

  async findByCustomer(id: string): Promise<Job[]> {
    return this.jobModel.find({ customerId: id }).exec();
  }

  async findByMaid(id: string): Promise<Job[]> {
    return this.jobModel.find({ maidId: id }).exec();
  }

  async createJob(
    customerId: string,
    createJobDto: CreateJobDto,
  ): Promise<Job> {
    // validate work
    createJobDto.work.forEach((work) => {
      if (!this.maidsService.isValidTypeOfWork(work.typeOfWork))
        throw new BadRequestException(
          work.typeOfWork + ' is not valid type of work',
        );
    });
    // create new job
    const createdJob = new this.jobModel(createJobDto);
    createdJob.customerId = customerId;
    await createdJob.save();
    await this.findMaid(createdJob);
    return createdJob;
  }

  async removeJob(id: string): Promise<Job> {
    const job = await this.findJob(id);
    if (!job) throw new NotFoundException('Job not valid');
    return await job.remove();
  }

  async findMaid(job: Job): Promise<Maid> {
    //TODO add workspace's latitude and longitude
    const nearestMaid = await this.maidsService.findNearestMaid(0, 0, job);
    if (nearestMaid) {
      job.maidId = nearestMaid._id;
      job.requestedMaid.push(nearestMaid._id);
      await job.save();
      nearestMaid.availability = false;
      await nearestMaid.save();
      console.log(nearestMaid._id); //TODO push notification to maid
    } else {
      job.maidId = null;
      await job.save();
      console.log('can not find any maid'); //TODO push notification to maid
    }
    return nearestMaid;
  }

  async reject(job: Job): Promise<Job> {
    this.maidsService.setAvailability(job.maidId, true);
    // find new maid
    await this.findMaid(job);
    return job;
  }
}
