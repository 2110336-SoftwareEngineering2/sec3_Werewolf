import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Post,
  UseGuards,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { AccessTokenDto } from './dto/accessToken.dto';

@Controller('auth')
@ApiTags('user')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiCreatedResponse({
    description: 'Login with email and password to get access token',
    type: AccessTokenDto,
  })
  @ApiResponse({ status: 401, description: 'email or password is incorrect' })
  @ApiResponse({ status: 403, description: 'email is not verified' })
  async login(@Body() login: LoginDto) {
    login.email = login.email.toLowerCase();
    try {
      return await this.authService.validateLogin(login.email, login.password);
    } catch (error) {
      throw error;
    }
  }

  @Get('user')
  @ApiCreatedResponse({
    description: 'Get user information',
    type: UserDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async getUser(@Request() req) {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) throw new NotFoundException('Invalid user');
    return new UserDto(user);
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'Create new user and send email verification',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'email, password or role is wrong',
  })
  @ApiResponse({ status: 409, description: 'user already registered' })
  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    try {
      const user = await this.usersService.register(createUserDto);
      await this.authService.createEmailToken(user.email, user.role);
      const isEmailSent = await this.authService.sendEmailVerification(
        user.email,
      );
      if (!isEmailSent) throw new UnprocessableEntityException();
      return new UserDto(user);
    } catch (error) {
      throw error;
    }
  }

  @Get('verify/:token')
  @ApiCreatedResponse({
    description: 'verify email with received token',
    type: Boolean,
  })
  @ApiResponse({
    status: 401,
    description: 'token not existed or have changed',
  })
  @ApiResponse({
    status: 404,
    description: 'invalid user',
  })
  async verifyEmail(@Param() params): Promise<boolean> {
    try {
      return await this.authService.verifyEmail(params.token);
    } catch (error) {
      throw error;
    }
  }
}
