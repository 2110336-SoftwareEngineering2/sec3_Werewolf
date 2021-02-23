import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Job } from './interfaces/job.interface';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(@Inject('JOB_MODEL') private jobModel: Model<Job>) {}

  async findJob(id: string): Promise<Job> {
    return this.jobModel.findOne({ _id: id }).exec();
  }

  async findByCustomer(id: string): Promise<Job[]> {
    return this.jobModel.find({ customerId: id }).exec();
  }

  async createPromotion(
    customerId: string,
    createJobDto: CreateJobDto,
  ): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    createdJob.customerId = customerId;
    return await createdJob.save();
  }

  async removeJob(id: string) {
    const job = await this.findJob(id);
    if (!job) throw new NotFoundException('Job not valid');
    return await job.remove();
  }
}
