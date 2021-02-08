import { Controller, Request, Get, Post, UseGuards, Param } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
	
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
}
