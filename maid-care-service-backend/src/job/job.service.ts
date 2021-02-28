import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Job } from './interfaces/job.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { WorkType } from './work';

@Injectable()
export class JobService {
  constructor(@Inject('JOB_MODEL') private jobModel: Model<Job>) {}

  async findJob(id: string): Promise<Job> {
    if (String(id).length === 24) {
      return this.jobModel.findOne({ _id: id }).exec();
    } else return null;
  }

  async findByCustomer(id: string): Promise<Job[]> {
    return this.jobModel.find({ customerId: id }).exec();
  }

  async createJob(
    customerId: string,
    createJobDto: CreateJobDto,
  ): Promise<Job> {
    // validate work
    createJobDto.work.forEach((work) => {
      if (!this.isValidTypeOfWork(work.typeOfWork))
        throw new BadRequestException(
          work.typeOfWork + ' is not valid type of work',
        );
    });
    // create new job
    const createdJob = new this.jobModel(createJobDto);
    createdJob.customerId = customerId;
    return await createdJob.save();
  }

  async removeJob(id: string): Promise<Job> {
    const job = await this.findJob(id);
    if (!job) throw new NotFoundException('Job not valid');
    return await job.remove();
  }

  isValidTypeOfWork(workType: string) {
    return (<any>Object).values(WorkType).includes(workType);
  }
}
