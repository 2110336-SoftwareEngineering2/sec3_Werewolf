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
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'create new user without email verification',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    try {
      const user = await this.usersService.register(createUserDto);
      user.valid = true;
      await user.save();
      return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: "return user's email, firstname, lastname, phone and role",
  })
  async getCustomer(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user) throw new NotFoundException('invalid user');
    const result = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      role: user.role,
    };
    return result;
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async updateProfile(@Request() req, @Body() profileDto: ProfileDto) {
    try {
      const user = await this.usersService.updateProfile(
        req.user._id,
        profileDto,
      );
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersService.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }

  @Put('reset-password')
  async resetPassord(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    if (!resetPasswordDto.newPassword)
      throw new BadRequestException('No new password');
    resetPasswordDto.email = resetPasswordDto.email.toLowerCase();
    try {
      const isValidPassword = await this.usersService.checkPassword(
        resetPasswordDto.email,
        resetPasswordDto.currentPassword,
      );
      if (!isValidPassword)
        throw new UnauthorizedException('Incorrect password');
      return await this.usersService.setPassword(
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
      );
    } catch (error) {
      throw error;
    }
  }
}
