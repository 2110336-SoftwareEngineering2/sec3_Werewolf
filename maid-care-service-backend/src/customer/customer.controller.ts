import {
  Controller,
  Request,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { JobService } from '../job/job.service';
import { JobDto } from 'src/job/dto/job.dto';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jobService: JobService,
  ) {}

  @Get('jobs')
  @ApiCreatedResponse({
    description: 'Get all jobs that belong to a customer',
    type: [JobDto],
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async findAllJobs(@Request() req) {
    if (req.user.role === 'customer') {
      return await this.jobService.findByCustomer(req.user._id);
    } else throw new UnauthorizedException('user is not customer');
  }
}
