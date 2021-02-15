import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('update-profile')
  async updateProfile(@Body() userDto: UserDto):Promise<any> {
    try {
      var user =  await this.usersService.updateProfile(userDto);
      var result = { firstname: user.firstname, lastname: user.lastname, phone: user.phone }
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('create-promotion')
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto):Promise<any> {
    try {
      var promotion = await this.usersService.createPromotion(createPromotionDto);
      var result = { code: promotion.code, description: promotion.description, availableDate: promotion.availableDate, expiredDate: promotion.expiredDate }
      return result;
    } catch (error) {
      throw error;
    }
  }
}