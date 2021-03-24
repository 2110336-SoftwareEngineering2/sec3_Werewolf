import {
  Controller,
  Request,
  Param,
  Get,
  Put,
  UseGuards,
  BadRequestException,
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
import { WalletService } from '../wallet/wallet.service';
import { JobService } from '../job/job.service';
import { JobDto } from 'src/job/dto/job.dto';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly walletService: WalletService,
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

  @Get('wallet')
  @ApiCreatedResponse({
    description: 'Get g-coin that customer have',
    type: Number,
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async getWallet(@Request() req) {
    if (req.user.role === 'customer') {
      const wallet = await this.walletService.findWallet(req.user._id);
      return wallet.g_coin;
    } else throw new UnauthorizedException('user is not customer');
  }

  @Put('add-coin/:g_coin')
  @ApiCreatedResponse({
    description: 'Add g-coin to the wallet',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'g-coin is less than zero or not a number',
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async addCoin(@Request() req, @Param('g_coin') g_coin_string: string) {
    if (req.user.role === 'customer') {
      const g_coin = Number(g_coin_string);
      if (!g_coin && g_coin != 0)
        throw new BadRequestException('g-coin must be a number');
      if (g_coin < 0)
        throw new BadRequestException('g-coin must not be negative');
      const wallet = await this.walletService.addCoin(req.user._id, g_coin);
      return wallet.g_coin;
    } else throw new UnauthorizedException('user is not customer');
  }
}
