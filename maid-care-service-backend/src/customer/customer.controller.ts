import {
  Controller,
  Request,
  Get,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { Customer } from './interfaces/customer.interface';

@Controller('customer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('acess-token')
@ApiTags('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('get-customer')
  async getCustomer(@Request() req) {
    if (req.user.role === 'customer') {
      try {
        let customer = await this.customerService.findCustomer(req.user.email);
        if (!customer) throw new ForbiddenException('Invalid customer');
        let result = {
          email: customer.email,
          g_coin: customer.g_coin,
        };
        return result;
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not customer');
  }
}
