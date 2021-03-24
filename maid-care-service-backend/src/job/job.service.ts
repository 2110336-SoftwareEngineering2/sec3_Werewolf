import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { MaidsService } from '../maids/maids.service';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { PromotionService } from 'src/promotion/promotion.service';
import { Job } from './interfaces/job.interface';
import { Maid } from 'src/maids/interfaces/maids.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { WorkType } from 'src/maids/workType';
import { WorkCost } from './workCost';
import { JobState } from './jobState';

@Injectable()
export class JobService {
  constructor(
    @Inject('JOB_MODEL') private jobModel: Model<Job>,
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
    private maidsService: MaidsService,
    private workspacesService: WorkspacesService,
    private promotionService: PromotionService,
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
      }
    });
    // create new job
    const createdJob = new this.jobModel(createJobDto);
    createdJob.customerId = customerId;
    createdJob.work.forEach((work) => {
      work.unit = this.getUnit(work.typeOfWork);
    });
    createdJob.cost = this.calculateSumCost(createdJob);
    if (createJobDto.promotionCode) {
      createdJob.cost = await this.calculatePromotion(
        createdJob.cost,
        createJobDto.promotionCode,
      );
    }
    await createdJob.save();
    return createdJob;
  }

  async applyPromotion(job: Job, code: string): Promise<Job> {
    job.cost = await this.calculatePromotion(this.calculateSumCost(job), code);
    return await job.save();
  }

  async calculatePromotion(cost: number, code: string) {
    const promotion = await this.promotionService.findPromotion(code);
    if (!promotion) throw new NotFoundException('Promotion not valid');
    const cerrentDate = new Date();
    if (
      (promotion.expiredDate && promotion.expiredDate < cerrentDate) ||
      promotion.availableDate > cerrentDate
    )
      throw new ConflictException('invalid promotion date');
    return cost * (1 - promotion.discountRate / 100);
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
      //expired in 60 seconds
      const cerrentTime = new Date();
      const expiredIn = 60000;
      job.expiryTime = new Date(cerrentTime.getTime() + expiredIn);
      await job.save();
      const callback = () => {
        this.reject(job);
      };
      await this.addTimeout(job, expiredIn, callback);
      //push notification to maid
      console.log('send request to maid ' + nearestMaid._id);
      await this.notificationService.sendNotification(
        nearestMaid._id,
        'new job',
      );
      await nearestMaid.save();
    } else {
      job.maidId = null;
      await job.save();
      //push notification to customer
      console.log('can not find any maid');
      await this.notificationService.sendNotification(
        job.customerId,
        'can not find any maid',
      );
      await job.delete();
    }
    return nearestMaid;
  }

  async reject(job: Job): Promise<Job> {
    await this.deleteTimeout(job);
    // find new maid
    await this.findMaid(job);
    return job;
  }

  async accept(job: Job): Promise<Job> {
    await this.deleteTimeout(job);
    job.state = JobState.matched;
    // send nofication to customer
    console.log('maid found');
    await this.notificationService.sendNotification(
      job.customerId,
      'maid found',
    );
    // customer comfirm in 60 seconds
    const cerrentTime = new Date();
    const expiredIn = 60000;
    job.expiryTime = new Date(cerrentTime.getTime() + expiredIn);
    await job.save();
    const callback = () => {
      this.confirm(job);
    };
    await this.addTimeout(job, expiredIn, callback);
    return await job.save();
  }

  async confirm(job: Job): Promise<Job> {
    job.state = JobState.confirmed;
    return await job.save();
  }

  async customer_cancel(job: Job): Promise<Job> {
    await this.deleteTimeout(job);
    job.state = JobState.canceled;
    this.maidsService.setAvailability(job.maidId, true);
    //push notification to maid
    console.log('customer cancel job');
    await this.notificationService.sendNotification(
      job.maidId,
      'customer cancel job',
    );
    return await job.save();
  }

  async jobDone(job: Job): Promise<Job> {
    job.state = JobState.done;
    // send nofication to customer
    console.log('job done');
    await this.notificationService.sendNotification(job.customerId, 'job done');
    return await job.save();
  }

  async jobReviewd(job: Job): Promise<Job> {
    job.state = JobState.reviewed;
    return await job.save();
  }

  async addTimeout(job: Job, milliseconds: number, callback) {
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(job.id, timeout);
  }

  async deleteTimeout(job: Job) {
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

  calculateSumCost(job: any) {
    const allWork = job.work;
    let sumCost = 0;
    for (const work of allWork) {
      const cost = this.calculateCost(work);
      work.cost = cost;
      sumCost += cost;
    }
    return sumCost;
  }

  calculateCost(work: any): number {
    const workType = work.typeOfWork;
    const quantity = work.quantity;
    let cost = 0;
    switch (workType) {
      case WorkType.house_cleaning: {
        cost = quantity * WorkCost.house_cleaningPrice;
        break;
      }
      case WorkType.dish_washing: {
        cost = quantity * WorkCost.dish_washingPrice;
        break;
      }
      case WorkType.laundry: {
        cost = quantity * WorkCost.laundryPrice;
        break;
      }
      case WorkType.gardening: {
        cost = quantity * WorkCost.gardeningPrice;
        break;
      }
      default: {
        break;
      }
    }
    return cost;
  }
}
