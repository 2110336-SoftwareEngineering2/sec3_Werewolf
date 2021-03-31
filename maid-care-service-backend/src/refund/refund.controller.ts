import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateRefundDto } from './dto/create-refund.dto';
import { RefundDto } from './dto/refund.dto';
import { RefundService } from './refund.service';

@Controller('refund')
@ApiTags('refund')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'customer create refund',
    type: RefundDto,
  })
  @ApiResponse({ status: 401, description: 'user is not customer' })
  @ApiResponse({
    status: 404,
    description: 'job not found or it is not your job',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @ApiBearerAuth('acess-token')
  async createRefund(@Request() req, @Body() createRefundDto: CreateRefundDto) {
    try {
      const refund = await this.refundService.createRefund(
        req.user._id,
        createRefundDto,
      );
      return await this.refundService.makeRefundDto(refund);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Get all refunds',
    type: [RefundDto],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('acess-token')
  async findAll() {
    const refunds = await this.refundService.findAll();
    const refundDtos = new Array(refunds.length);
    for (let i = 0; i < refunds.length; i++) {
      refundDtos[i] = await this.refundService.makeRefundDto(refunds[i]);
    }
    return refundDtos;
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: 'Get refund by refund id',
    type: RefundDto,
  })
  @ApiResponse({ status: 404, description: 'refund not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiBearerAuth('acess-token')
  async findRefund(@Request() req, @Param('id') id: string) {
    const refund = await this.refundService.findRefund(id);
    if (
      !refund ||
      (req.user.role === 'customer' && req.user._id != refund.customerId)
    )
      throw new NotFoundException('refund not found');
    return await this.refundService.makeRefundDto(refund);
  }

  @Get('customer/:uid')
  @ApiCreatedResponse({
    description: 'Get all refunds of a customer',
    type: [RefundDto],
  })
  @ApiResponse({
    status: 401,
    description: 'can only get your refund unless user is admin',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiBearerAuth('acess-token')
  async findByCustomer(@Request() req, @Param('uid') uid: string) {
    if (req.user.role === 'admin' || req.user._id == uid) {
      const refunds = await this.refundService.findByCustomer(uid);
      const refundDtos = new Array(refunds.length);
      for (let i = 0; i < refunds.length; i++) {
        refundDtos[i] = await this.refundService.makeRefundDto(refunds[i]);
      }
      return refundDtos;
    } else {
      throw new UnauthorizedException('can not get refund of other user');
    }
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Delete refund by refund id',
    type: RefundDto,
  })
  @ApiResponse({ status: 401, description: 'user is not admin' })
  @ApiResponse({ status: 404, description: 'refund not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('acess-token')
  async removePromotion(@Param('id') id: string) {
    try {
      const refund = await this.refundService.removeRefund(id);
      return await this.refundService.makeRefundDto(refund);
    } catch (error) {
      throw error;
    }
  }
}
