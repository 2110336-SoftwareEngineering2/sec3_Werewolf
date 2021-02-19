import {
  Controller,
  Body,
  Request,
  Get,
  Post,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './interfaces/users.interface';
import { ProfileDto } from './dto/profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('acess-token')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-user')
  async getUser(@Request() req): Promise<User> {
    try {
      let user = await this.usersService.findUser(req.user.email);
      if (!user) throw new ForbiddenException('Invalid user');
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('update-profile')
  async updateProfile(
    @Request() req,
    @Body() profileDto: ProfileDto,
  ): Promise<ProfileDto> {
    try {
      let user = await this.usersService.updateProfile(
        req.user.email,
        profileDto,
      );
      return new ProfileDto(user);
    } catch (error) {
      throw error;
    }
  }
}
