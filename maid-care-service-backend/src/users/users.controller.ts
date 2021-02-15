import { Controller, Body, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from './users.service';
import { ProfileDto } from './dto/profile.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('update-profile')
  async updateProfile(@Request() req, @Body() profileDto: ProfileDto):Promise<ProfileDto> {
    try {
      var user =  await this.usersService.updateProfile(req.user.email, profileDto);
      return new ProfileDto(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('create-promotion')
  async createPromotion(@Request() req, @Body() createPromotionDto: CreatePromotionDto):Promise<any> {
    try {
      var promotion = await this.usersService.createPromotion(req.user.email, createPromotionDto);
      return { code: promotion.code, description: promotion.description, availableDate: promotion.availableDate, expiredDate: promotion.expiredDate };
    } catch (error) {
      throw error;
    }
  }
}