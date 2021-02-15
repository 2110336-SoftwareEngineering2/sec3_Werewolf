import { Controller, Body, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from './users.service';
import { ProfileDto } from './dto/profile.dto';

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
}