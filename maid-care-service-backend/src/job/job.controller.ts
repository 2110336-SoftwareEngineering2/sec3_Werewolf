import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
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
      const Job = await this.jobService.createJob(req.user._id, createJobDto);
      return Job;
    } else throw new UnauthorizedException('user is not customer');
  }

  @Get(':id')
  async findJob(@Param('id') id: string) {
    const job = await this.jobService.findJob(id);
    if (!job) throw new NotFoundException('Job not valid');
    return job;
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
}
