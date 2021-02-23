import {
  Controller,
  Request,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { JobService } from '../job/job.service';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jobService: JobService,
  ) {}

  @Get('jobs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async findAllJob(@Request() req) {
    if (req.user.role === 'customer') {
      return await this.jobService.findByCustomer(req.user._id);
    } else throw new UnauthorizedException('user is not customer');
  }
}
