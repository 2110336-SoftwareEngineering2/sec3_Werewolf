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
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDto } from './dto/job.dto';

@Controller('job')
@ApiTags('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiCreatedResponse({ type: JobDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async postJob(@Request() req, @Body() createJobDto: CreateJobDto) {
    if (req.user.role === 'customer') {
      const job = await this.jobService.createJob(req.user._id, createJobDto);
      return new JobDto(job);
    } else throw new UnauthorizedException('user is not customer');
  }

  @Get(':id')
  @ApiCreatedResponse({ type: JobDto })
  async findJob(@Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (!job) throw new NotFoundException('job not valid');
    return new JobDto(job);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: JobDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async removeJob(@Request() req, @Param('id') id: string) {
    if (req.user.role === 'admin') {
      try {
        const job = await this.jobService.removeJob(id);
        return new JobDto(job);
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not admin');
  }

  @Get('maid/:id')
  @ApiCreatedResponse({ type: [JobDto] })
  async findByMaid(@Param('id') id: string) {
    return await this.jobService.findByMaid(id);
  }

  @Put(':id/reject')
  @ApiCreatedResponse({ type: JobDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async reject(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === 'posted' &&
      req.user._id == job.maidId &&
      job.expiryTime > new Date()
    ) {
      this.jobService.deleteTimeout(job);
      await this.jobService.reject(job);
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }

  @Put(':id/accept')
  @ApiCreatedResponse({ type: JobDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async accept(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (
      job &&
      job.state === 'posted' &&
      req.user._id == job.maidId &&
      job.expiryTime > new Date()
    ) {
      this.jobService.deleteTimeout(job);
      job.state = 'matched';
      await job.save();
      return new JobDto(job);
    } else throw new NotFoundException('job not found');
  }
}
