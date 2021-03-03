import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  UseGuards,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Login } from './dto/login';
import { CreateUserDto } from '../users/dto/create-user.dto';

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

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  @ApiCreatedResponse({
    description: "return user's id, email, firstname, lastname, phone and role",
  })
  async getUser(@Request() req) {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) throw new ForbiddenException('Invalid user');
    return {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      citizenId: user.citizenId,
      nationality: user.nationality,
      bankAccountNumber: user.bankAccountNumber,
      role: user.role,
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    try {
      const user = await this.usersService.register(createUserDto);
      await this.authService.createEmailToken(user.email, user.role);
      const isEmailSent = await this.authService.sendEmailVerification(
        user.email,
      );
      if (!isEmailSent) throw new UnprocessableEntityException();
      return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        birthdate: user.birthdate,
        citizenId: user.citizenId,
        nationality: user.nationality,
        bankAccountNumber: user.bankAccountNumber,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('verify/:token')
  async verifyEmail(@Param() params): Promise<boolean> {
    try {
      return await this.authService.verifyEmail(params.token);
    } catch (error) {
      throw error;
    }
  }
}
