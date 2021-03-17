import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { MaidsService } from '../maids/maids.service';
import { Job } from './interfaces/job.interface';
import { Maid } from 'src/maids/interfaces/maids.interface';
import { CreateJobDto, Work } from './dto/create-job.dto';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { workCost } from './workCost';
import { Promotion } from 'src/promotion/interfaces/promotion.interface';

@Injectable()
export class JobService {
  constructor(
    @Inject('JOB_MODEL') private jobModel: Model<Job>,
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
    private maidsService: MaidsService,
    private workspacesService: WorkspacesService,
    private workcost: workCost
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

  calculateSumCost(job: Job){
    const allWork = job.work;
    let sumCost = 0;
    for ( var work of allWork){
      const cost = this.calculateCost(work);
      sumCost += cost; 
    }
    return sumCost;
  }

  calculateCost(work: Work): number{
    const workType = work.typeOfWork;
    const quantity = work.quantity;
    let cost = 0;
    switch(workType) {
      case('House Cleaning'): {
        cost = quantity * this.workcost.house_cleaningPrice;
        break;
      }
      case('Dish Washing'): {
        cost = quantity * this.workcost.dish_washingPrice;
        break;
      }
      case('Laundry'): {
        cost = quantity * this.workcost.laundryPrice;
        break;
      }
      case('Gardening'): {
        cost = quantity * this.workcost.gardeningPrice;
        break;
      }
      default: {
        break;
      }
    }
    return cost;
  }
}
