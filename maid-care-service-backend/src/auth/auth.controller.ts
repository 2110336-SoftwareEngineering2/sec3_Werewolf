import { Controller, Body, Param, Get, Post, Delete, BadRequestException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';
import { Login } from './interfaces/login.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() login: Login) {
    try {
      return await this.authService.validateLogin(login.email, login.password)
    } catch (error) {
      throw error;
    }
  }

  //create new user without email verification
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
	try {
      var user = await this.authService.register(createUserDto);
      user.valid = true;
      await user.save();
      return { email:user.email, firstname: user.firstname, lastname: user.lastname, phone: user.phone, role: user.role };
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
	try {
      var user = await this.authService.register(createUserDto);
      await this.authService.createEmailToken(user.email);
      var isEmailSent = await this.authService.sendEmailVerification(user.email);
      if (!isEmailSent) throw new UnprocessableEntityException();
      return { email:user.email, firstname: user.firstname, lastname: user.lastname, phone: user.phone, role: user.role };
    } catch (error) {
      throw error;
    }
  }

  @Get('verify/:token')
  async verifyEmail(@Param() params): Promise<boolean> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(params.token);
      return isEmailVerified;
    } catch (error) {
      throw error;
    }
  }

  @Post('reset-password')
  async resetPassord(@Body() resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    if (!resetPasswordDto.newPassword) throw new BadRequestException('No new password');
    try {
      var isValidPassword = await this.authService.checkPassword(resetPasswordDto.email, resetPasswordDto.currentPassword);
      if(!isValidPassword) throw new UnauthorizedException('Incorrect password');
      return await this.usersService.setPassword(resetPasswordDto.email, resetPasswordDto.newPassword);
    } catch(error) {
      throw error;
    }
  }

  @Delete('delete-user')
  async deleteUser(@Body() login: Login) {
    try {
      return await this.authService.deleteUser(login.email, login.password);
    } catch (error) {
      throw error;
    }
  }
}