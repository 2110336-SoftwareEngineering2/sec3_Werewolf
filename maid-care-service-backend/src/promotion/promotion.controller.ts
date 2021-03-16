import {
  Controller,
  Body,
  Request,
  Param,
  Get,
  Post,
  Delete,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { PromotionDto } from './dto/promotion.dto';

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @ApiCreatedResponse({ type: PromotionDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async createPromotion(
    @Request() req,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    if (req.user.role === 'admin') {
      try {
        const promotion = await this.promotionService.createPromotion(
          req.user._id,
          createPromotionDto,
        );
        return new PromotionDto(promotion);
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not admin');
  }

  @Get(':code')
  @ApiCreatedResponse({ type: PromotionDto })
  async findPromotion(@Param('code') code: string) {
    const promotion = await this.promotionService.findPromotion(code);
    if (!promotion) throw new NotFoundException('Promotion not valid');
    return new PromotionDto(promotion);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  @ApiCreatedResponse({ type: [PromotionDto] })
  async findAll(@Request() req) {
    if (req.user.role === 'admin') {
      return await this.promotionService.findAll();
    }
  }

  @Delete(':code')
  @ApiCreatedResponse({ type: PromotionDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async removePromotion(@Request() req, @Param('code') code: string) {
    if (req.user.role === 'admin') {
      try {
        const promotion = await this.promotionService.removePromotion(code);
        return new PromotionDto(promotion);
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not admin');
  }
}
