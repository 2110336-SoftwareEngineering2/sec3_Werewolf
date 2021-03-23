import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'create new user without email verification',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'email, password or role is wrong',
  })
  @ApiResponse({ status: 409, description: 'user already registered' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    try {
      const user = await this.usersService.register(createUserDto);
      user.valid = true;
      await user.save();
      return new UserDto(user);
    } catch (error) {
      throw error;
    }
  }

  @Get(':uid')
  @ApiCreatedResponse({
    description: 'Get user with uid',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'invalid user' })
  async getCustomer(@Param('uid') id: string) {
    const user = await this.usersService.findUser(id);
    if (!user) throw new NotFoundException('invalid user');
    return new UserDto(user);
  }

  @Put('update-profile')
  @ApiCreatedResponse({
    description: 'Change password or profile information',
    type: UserDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async updateProfile(@Request() req, @Body() profileDto: ProfileDto) {
    try {
      const user = await this.usersService.updateProfile(
        req.user._id,
        profileDto,
      );
      return new UserDto(user);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':uid')
  @ApiCreatedResponse({
    description: 'Delete user by uid',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'invalid user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async deleteUser(@Request() req, @Param('uid') id: string) {
    if (req.user.role === 'admin' || req.user._id == id) {
      try {
        const user = await this.usersService.deleteUser(id);
        return new UserDto(user);
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException();
  }

  @Put('reset-password')
  @ApiCreatedResponse({
    description: 'Change password by entering cerrent password and email',
    type: Boolean,
  })
  @ApiResponse({ status: 400, description: 'no new password' })
  @ApiResponse({ status: 401, description: 'old password is incorrect' })
  async resetPassord(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    if (!resetPasswordDto.newPassword)
      throw new BadRequestException('no new password');
    resetPasswordDto.email = resetPasswordDto.email.toLowerCase();
    try {
      const isValidPassword = await this.usersService.checkPassword(
        resetPasswordDto.email,
        resetPasswordDto.currentPassword,
      );
      if (!isValidPassword)
        throw new UnauthorizedException('incorrect password');
      return await this.usersService.setPassword(
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
      );
    } catch (error) {
      throw error;
    }
  }
}
