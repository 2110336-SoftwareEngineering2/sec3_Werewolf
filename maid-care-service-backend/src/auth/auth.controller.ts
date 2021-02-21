import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  Delete,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Login } from './dto/login';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/interfaces/users.interface';

@Controller('auth')
@ApiTags('user')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() login: Login) {
    login.email = login.email.toLowerCase();
    try {
      return await this.authService.validateLogin(login.email, login.password);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async getUser(@Request() req) {
    try {
      let user = await this.usersService.findUser(req.user.email);
      if (!user) throw new ForbiddenException('Invalid user');
      let result = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        role: user.role,
      };
      return result;
    } catch (error) {
      throw error;
    }
  }

  //create new user without email verification
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    try {
      let user = await this.authService.register(createUserDto);
      user.valid = true;
      await user.save();
      return {
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

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    try {
      let user = await this.authService.register(createUserDto);
      await this.authService.createEmailToken(user.email, user.role);
      let isEmailSent = await this.authService.sendEmailVerification(
        user.email,
      );
      if (!isEmailSent) throw new UnprocessableEntityException();
      return {
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

  @Get('verify/:token')
  async verifyEmail(@Param() params): Promise<boolean> {
    try {
      let isEmailVerified = await this.authService.verifyEmail(params.token);
      return isEmailVerified;
    } catch (error) {
      throw error;
    }
  }

  @Post('reset-password')
  async resetPassord(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    if (!resetPasswordDto.newPassword)
      throw new BadRequestException('No new password');
    resetPasswordDto.email = resetPasswordDto.email.toLowerCase();
    try {
      let isValidPassword = await this.authService.checkPassword(
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

  @Delete('delete-user')
  async deleteUser(@Body() login: Login) {
    login.email = login.email.toLowerCase();
    try {
      return await this.authService.deleteUser(
        login.email.toLowerCase(),
        login.password,
      );
    } catch (error) {
      throw error;
    }
  }
}
