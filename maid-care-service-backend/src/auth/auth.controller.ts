import { Controller, Request, Body, Get, Post, UseGuards, Param } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
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