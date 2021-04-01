import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JobService } from './job.service';
import { CostDto } from './dto/cost.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDto } from './dto/job.dto';
import { MaidsService } from '../maids/maids.service';
import { JobState } from './jobState';
import { PhotoDto } from './dto/photo.dto';

@Controller('job')
@ApiTags('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private maidsService: MaidsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Customer create new job', type: JobDto })
  @ApiResponse({ status: 400, description: 'wrong workplaceId or typeOfWork' })
  @ApiResponse({
    status: 401,
    description: 'user is not customer, only customer can post job',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async createJob(@Request() req, @Body() createJobDto: CreateJobDto) {
    const job = await this.jobService.createJob(req.user._id, createJobDto);
    return new JobDto(job);
  }

  @Put(':id/apply-promotion/:code')
  @ApiCreatedResponse({
    description: 'Apply promotion cost to a job to get discount',
    type: JobDto,
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @ApiResponse({ status: 404, description: 'job not found or wrong state' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async applyPromotion(
    @Request() req,
    @Param('id') id: string,
    @Param('code') code: string,
  ) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === JobState.creating &&
      req.user._id == job.customerId
    ) {
      try {
        await this.jobService.applyPromotion(job, code);
      } catch (error) {
        throw error;
      }
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put('cost')
  @ApiCreatedResponse({
    description: 'Calculate cost of a job',
    type: CostDto,
  })
  @ApiResponse({ status: 404, description: 'promotion not found' })
  @ApiResponse({
    status: 409,
    description: 'promotion already expired or not start yet',
  })
  async calculateCost(@Body() createJobDto: CreateJobDto) {
    const job = new CostDto(createJobDto);
    job.cost = await this.jobService.calculateSumCost(createJobDto);
    if (createJobDto.promotionCode) {
      job.cost = await this.jobService.calculatePromotion(
        job.cost,
        createJobDto.promotionCode,
      );
    }
    job.work.forEach((work) => {
      work.unit = this.jobService.getUnit(work.typeOfWork);
    });
    return job;
  }

  @Put(':id/find-maid')
  @ApiCreatedResponse({
    description: 'Start finding maid for a job',
    type: JobDto,
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @ApiResponse({ status: 404, description: 'job not found or wrong state' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async findMaid(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === JobState.creating &&
      req.user._id == job.customerId
    ) {
      job.state = JobState.posted;
      await job.save();
      this.jobService.findMaid(job);
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Get job by id', type: JobDto })
  @ApiResponse({ status: 404, description: 'job not found' })
  async findJob(@Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (!job) throw new NotFoundException('job not found');
    return new JobDto(job);
  }

  @Delete(':id')
  @ApiCreatedResponse({ description: 'Delete job by id', type: JobDto })
  @ApiResponse({
    status: 404,
    description: 'job not found or it is not your job',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiBearerAuth('acess-token')
  async removeJob(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (!job) throw new NotFoundException('job not found');
    if (req.user.role === 'admin' || req.user._id == job.customerId) {
      try {
        await this.jobService.removeJob(id);
        return new JobDto(job);
      } catch (error) {
        throw error;
      }
    } else throw new NotFoundException('job not found');
  }

  @Post('photo')
  @ApiCreatedResponse({
    description: 'maid add new photo to the job',
    type: [JobDto],
  })
  @ApiResponse({ status: 404, description: 'job not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async addPhoto(@Request() req, @Body() photoDto: PhotoDto) {
    const job = await this.jobService.findJob(photoDto.jobId);
    if (!job) throw new NotFoundException('job not found');
    if (job && req.user._id == job.maidId) {
      try {
        if (!job.photos.includes(photoDto.url)) job.photos.push(photoDto.url);
        await job.save();
        return new JobDto(job);
      } catch (error) {
        throw error;
      }
    } else throw new NotFoundException('job not found');
  }

  @Delete('photo/:url')
  @ApiCreatedResponse({
    description: 'maid delete a photo of the job',
    type: [JobDto],
  })
  @ApiResponse({ status: 404, description: 'photo not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async deletePhoto(@Request() req, @Body() photoDto: PhotoDto) {
    const job = await this.jobService.findJob(photoDto.jobId);
    if (job && req.user._id == job.maidId) {
      try {
        if (!job.photos.includes(photoDto.url))
          throw new NotFoundException('url not found');
        job.photos = job.photos.filter((url) => url !== photoDto.url);
        await job.save();
        return new JobDto(job);
      } catch (error) {
        throw error;
      }
    } else throw new NotFoundException('photo not found');
  }

  @Get('maid/:uid')
  @ApiCreatedResponse({
    description: 'Get all jobs that belong to a maid with uid',
    type: [JobDto],
  })
  async findByMaid(@Param('uid') id: string) {
    return await this.jobService.findByMaid(id);
  }

  @Put(':id/reject')
  @ApiCreatedResponse({ description: 'maid reject job', type: JobDto })
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @ApiResponse({
    status: 404,
    description: 'job not found or already timed out',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async reject(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === JobState.posted &&
      req.user._id == job.maidId &&
      job.expiryTime > new Date()
    ) {
      await this.jobService.reject(job);
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put(':id/accept')
  @ApiCreatedResponse({ description: 'maid accept job', type: JobDto })
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @ApiResponse({
    status: 404,
    description: 'job not found or already timed out',
  })
  @ApiResponse({
    status: 409,
    description:
      'cannot accept job because maid have unfinished job or their availability is false',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async accept(@Request() req, @Param('id') id: string) {
    const maid = await this.maidsService.findMaid(req.user._id);
    if (!maid || !maid.availability)
      throw new ConflictException('cannot accept');
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === JobState.posted &&
      req.user._id == job.maidId &&
      job.expiryTime > new Date()
    ) {
      this.maidsService.setAvailability(req.user._id, false);
      await this.jobService.accept(job);
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put(':id/customer-cancel')
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @ApiCreatedResponse({
    description: 'customer cancel job in 60 seconds',
    type: JobDto,
  })
  @ApiResponse({
    status: 404,
    description: 'job not found or already confirmed automatically',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async cancel(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === JobState.matched &&
      req.user._id == job.customerId &&
      job.expiryTime > new Date()
    ) {
      await this.jobService.customer_cancel(job);
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put(':id/customer-confirm')
  @ApiCreatedResponse({
    description: 'customer confirm job in 60 seconds',
    type: JobDto,
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @ApiResponse({
    status: 404,
    description: 'job not found or already confirmed automatically',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async confirm(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === JobState.matched &&
      req.user._id == job.customerId &&
      job.expiryTime > new Date()
    ) {
      await this.jobService.deleteTimeout(job);
      await this.jobService.confirm(job);
      await job.save();
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put(':id/done')
  @ApiCreatedResponse({ description: 'maid finish job', type: JobDto })
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @ApiResponse({
    status: 404,
    description: 'job not found, already canceled or not confirmed yet',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async jobDone(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (job && job.state === JobState.confirmed && req.user._id == job.maidId) {
      this.maidsService.setAvailability(req.user._id, true);
      await this.jobService.jobDone(job);
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put(':id/maid-cancel-job')
  @ApiCreatedResponse({description: 'maid cancel job', type: JobDto})
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @ApiResponse({
    status: 404,
    description: 'job not found'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async jobMaidCancel(@Request() req, @Param('id') id: string ) {
    const job = await this.jobService.maidCancleJob(req.users._id, id);
    if(!job){
      throw new NotFoundException('job not found');
    }
    return new JobDto(job);
  }
}
