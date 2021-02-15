import { Controller, Body, Request, Param, Get, Post, Delete, UseGuards, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('create-promotion')
  @UseGuards(JwtAuthGuard)
  async createPromotion(@Request() req, @Body() createPromotionDto: CreatePromotionDto):Promise<any> {
    if (req.user.role === "admin") {
      var promotion = await this.promotionService.createPromotion(req.user.email, createPromotionDto);
      return { code: promotion.code, description: promotion.description, availableDate: promotion.availableDate, expiredDate: promotion.expiredDate };
    } else throw new UnauthorizedException('user is not admin');
  }

  @Get(':code')
  async findPromotion(@Param('code') code: string) {
    var promotion = await this.promotionService.findPromotion(code);
    if (!promotion) throw new NotFoundException('Promotion not valid');
    return promotion;
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  async removePromotion(@Request() req, @Param('code') code: string) {
    if (req.user.role === "admin") {
        try {
          return await this.promotionService.removePromotion(code);
        } catch (error) {
          throw error;
        }
    } else throw new UnauthorizedException('user is not admin');
  }
}
