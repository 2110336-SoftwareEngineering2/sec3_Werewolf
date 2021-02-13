import { Controller, Body, Param, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';
import { Login } from './interfaces/login.interface';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @Post('login')
  async login(@Body() login: Login) {
    try {
      return await this.authService.validateUser(login.email, login.password)
    } catch(error){
      throw error;
    }
  }

  @Get('send-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<boolean> {
    var isEmailSent = await this.authService.sendEmailVerification(params.email);
    return isEmailSent;
  }

  @Post('register')
  async register(@Body() createUserDto: UserDto): Promise<User> {
	try {
      var user = await this.userService.createNewUser(createUserDto);
      return user;
	} catch(error){
      throw error;
    }
  }
}