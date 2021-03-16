import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { MaidsService } from '../maids/maids.service';
import { Job } from './interfaces/job.interface';
import { Maid } from 'src/maids/interfaces/maids.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { WorkType } from 'src/maids/workType';

@Injectable()
export class JobService {
  constructor(
    @Inject('JOB_MODEL') private jobModel: Model<Job>,
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
    private maidsService: MaidsService,
    private workspacesService: WorkspacesService,
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
    // validate workspace
    const workspace = await this.workspacesService.findOne(
      createJobDto.workplaceId,
    );
    if (!workspace)
      throw new BadRequestException(
        createJobDto.workplaceId + ' is not valid id',
      );
    // validate work
    createJobDto.work.forEach((work) => {
      if (!this.maidsService.isValidTypeOfWork(work.typeOfWork)) {
        throw new BadRequestException(
          work.typeOfWork + ' is not valid type of work',
        );
      } else {
        work.unit = this.getUnit(work.typeOfWork);
      }
    });
    // create new job
    const createdJob = new this.jobModel(createJobDto);
    createdJob.customerId = customerId;
    await createdJob.save();
    const copyJob = createdJob;
    await this.findMaid(createdJob);
    return copyJob;
  }

  async removeJob(id: string): Promise<Job> {
    const job = await this.findJob(id);
    if (!job) throw new NotFoundException('Job not valid');
    return await job.remove();
  }

  async findMaid(job: Job): Promise<Maid> {
    const workspace = await this.workspacesService.findOne(job.workplaceId);
    const nearestMaid = await this.maidsService.findNearestMaid(
      workspace.latitude,
      workspace.longitude,
      job,
    );
    if (nearestMaid) {
      job.maidId = nearestMaid._id;
      job.requestedMaid.push(nearestMaid._id);
      const cerrentTime = new Date();
      //expired in 30 seconds
      const expiredIn = 30000;
      job.expiryTime = new Date(cerrentTime.getTime() + expiredIn);
      await job.save();
      this.addTimeout(job, expiredIn);
      //push notification to maid
      await this.notificationService.sendNotification(
        nearestMaid._id,
        'new job',
      );
      nearestMaid.availability = false;
      await nearestMaid.save();
    } else {
      job.maidId = null;
      await job.save();
      //push notification to customer
      await this.notificationService.sendNotification(
        job.customerId,
        'can not find any maid',
      );
      await job.delete();
    }
    return nearestMaid;
  }

  async reject(job: Job): Promise<Job> {
    this.maidsService.setAvailability(job.maidId, true);
    // find new maid
    await this.findMaid(job);
    return job;
  }

  addTimeout(job: Job, milliseconds: number) {
    const callback = () => {
      this.reject(job);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(job.id, timeout);
  }

  deleteTimeout(job: Job) {
    this.schedulerRegistry.deleteTimeout(job.id);
  }

  getUnit(workType: string) {
    switch (workType) {
      case WorkType.house_cleaning: {
        return 'ตารางเมตร';
      }
      case WorkType.dish_washing: {
        return 'จาน';
      }
      case WorkType.laundry: {
        return 'ตัว';
      }
      case WorkType.gardening: {
        return 'ตารางเมตร';
      }
      default: {
        throw new ForbiddenException(workType + ' is not valid type of work');
      }
    }
  }
}
