import { Controller, Body, Get, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Login } from './interfaces/login.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService ) {}

  @Post('login')
  async login(@Body() login: Login) {
	var user = await this.authService.validateUser(login.email, login.password)
	if (!user) {
      return false;
    }
    return user;
  }

  @Get('send-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<boolean> {
    var isEmailSent = await this.authService.sendEmailVerification(params.email);
    return isEmailSent;
  }

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    return await this.userService.createNewUser(createUserDto);
  }
}