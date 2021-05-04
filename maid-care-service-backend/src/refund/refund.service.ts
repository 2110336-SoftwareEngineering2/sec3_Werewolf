import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { JobService } from '../job/job.service';
import { UsersService } from '../users/users.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { RefundDto } from './dto/refund.dto';
import { Refund } from './interfaces/refund.interface';

@Injectable()
export class RefundService {
  constructor(
    @Inject('REFUND_MODEL') private refundModel: Model<Refund>,
    private jobService: JobService,
    private usersService: UsersService,
  ) {}

  async findRefund(id: string): Promise<Refund> {
    return this.refundModel.findOne({ _id: id }).exec();
  }

  async findAll(): Promise<Refund[]> {
    return this.refundModel.find().exec();
  }

  async findByCustomer(uid: string): Promise<Refund[]> {
    return this.refundModel.find({ customerId: uid }).exec();
  }

  async createRefund(
    creater: string,
    createRefundDto: CreateRefundDto,
  ): Promise<Refund> {
    //validate jobId
    const job = await this.jobService.findJob(createRefundDto.jobId);
    if (!job || job.customerId != creater)
      throw new NotFoundException('job not found');
    const createdRefund = new this.refundModel(createRefundDto);
    createdRefund.customerId = creater;
    return await createdRefund.save();
  }

  async removeRefund(id: string): Promise<Refund> {
    const refund = await this.findRefund(id);
    if (!refund) throw new NotFoundException('refund not found');
    return await refund.remove();
  }

  async makeRefundDto(refund: Refund): Promise<RefundDto> {
    const refundDto = new RefundDto(refund);
    refundDto.customer = await this.usersService.findUser(refund.customerId);
    refundDto.job = await this.jobService.findJob(refund.jobId);
    return refundDto;
  }
}
