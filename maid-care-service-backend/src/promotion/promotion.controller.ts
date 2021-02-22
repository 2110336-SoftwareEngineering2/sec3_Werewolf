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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotion')
@ApiTags('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async createPromotion(
    @Request() req,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    if (req.user.role === 'admin') {
      const promotion = await this.promotionService.createPromotion(
        req.user.email,
        createPromotionDto,
      );
      return {
        code: promotion.code,
        description: promotion.description,
        availableDate: promotion.availableDate,
        expiredDate: promotion.expiredDate,
      };
    } else throw new UnauthorizedException('user is not admin');
  }

  @Get(':code')
  async findPromotion(@Param('code') code: string) {
    const promotion = await this.promotionService.findPromotion(code);
    if (!promotion) throw new NotFoundException('Promotion not valid');
    return promotion;
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async removePromotion(@Request() req, @Param('code') code: string) {
    if (req.user.role === 'admin') {
      try {
        return await this.promotionService.removePromotion(code);
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not admin');
  }
}
