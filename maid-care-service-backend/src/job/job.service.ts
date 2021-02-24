import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Job } from './interfaces/job.interface';
import { CreateJobDto } from './dto/create-job.dto';

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
    createJobDto.work.forEach((work) => {
      if (!this.isValidTypeOfWork(work.typeOfWork))
        throw new BadRequestException(
          work.typeOfWork +
            ' is not valid. Type of work must be washing_dish, cleaning_room or ironing',
        );
    });
    const createdJob = new this.jobModel(createJobDto);
    createdJob.customerId = customerId;
    return await createdJob.save();
  }

  async removeJob(id: string) {
    const job = await this.findJob(id);
    if (!job) throw new NotFoundException('Job not valid');
    return await job.remove();
  }

  isValidTypeOfWork(type: string) {
    return (
      type === 'washing_dish' || type === 'cleaning_room' || type === 'ironing'
    );
  }
}
