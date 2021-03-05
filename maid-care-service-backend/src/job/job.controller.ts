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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('job')
@ApiTags('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async postJob(@Request() req, @Body() createJobDto: CreateJobDto) {
    if (req.user.role === 'customer') {
      const job = await this.jobService.createJob(req.user._id, createJobDto);
      return {
        id: job._id,
        customerId: job.customerId,
        maidId: job.maidId,
        workplaceId: job.workplaceId,
        work: job.work,
      };
    } else throw new UnauthorizedException('user is not customer');
  }

  @Get(':id')
  async findJob(@Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (!job) throw new NotFoundException('job not valid');
    return {
      id: job._id,
      customerId: job.customerId,
      maidId: job.maidId,
      workplaceId: job.workplaceId,
      work: job.work,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async removeJob(@Request() req, @Param('id') id: string) {
    if (req.user.role === 'admin') {
      try {
        return await this.jobService.removeJob(id);
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not admin');
  }

  @Get('maid/:id')
  async findByMaid(@Param('id') id: string) {
    return await this.jobService.findByMaid(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async reject(@Request() req, @Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (job && req.user._id == job.maidId) {
      return await this.jobService.reject(job);
    } else throw new NotFoundException('job not valid');
  }
}
