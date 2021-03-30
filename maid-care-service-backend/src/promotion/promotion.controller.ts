import {
  Controller,
  Body,
  Request,
  Param,
  Get,
  Post,
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
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { PromotionDto } from './dto/promotion.dto';

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Admin create promotion',
    type: PromotionDto,
  })
  @ApiResponse({ status: 400, description: 'wrong discountRate or date' })
  @ApiResponse({ status: 401, description: 'user is not admin' })
  @ApiResponse({
    status: 409,
    description: 'this promotion code already exist',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('acess-token')
  async createPromotion(
    @Request() req,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    try {
      const promotion = await this.promotionService.createPromotion(
        req.user._id,
        createPromotionDto,
      );
      return new PromotionDto(promotion);
    } catch (error) {
      throw error;
    }
  }

  @Get(':code')
  @ApiCreatedResponse({
    description: 'Get promotion by promotion code',
    type: PromotionDto,
  })
  @ApiResponse({ status: 404, description: 'promotion not valid' })
  async findPromotion(@Param('code') code: string) {
    const promotion = await this.promotionService.findPromotion(code);
    const cerrentDate = new Date();
    if (!promotion) throw new NotFoundException('Promotion not valid');
    if (
      (promotion.expiredDate && promotion.expiredDate < cerrentDate) ||
      promotion.availableDate > cerrentDate
    )
      throw new ConflictException('unavailable promotion date');
    return new PromotionDto(promotion);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Admin get all promotions',
    type: [PromotionDto],
  })
  @ApiResponse({ status: 401, description: 'user is not admin' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('acess-token')
  async findAll() {
    return await this.promotionService.findAll();
  }

  @Delete(':code')
  @ApiCreatedResponse({
    description: 'Delete promotion by promotion code',
    type: PromotionDto,
  })
  @ApiResponse({ status: 401, description: 'user is not admin' })
  @ApiResponse({ status: 404, description: 'promotion not valid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('acess-token')
  async removePromotion(@Param('code') code: string) {
    try {
      const promotion = await this.promotionService.removePromotion(code);
      return new PromotionDto(promotion);
    } catch (error) {
      throw error;
    }
  }
}
