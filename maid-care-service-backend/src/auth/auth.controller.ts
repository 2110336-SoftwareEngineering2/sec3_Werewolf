import { Controller, Body, Param, Get, Post, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerService } from '../customer/customer.service';
import { MaidsService } from '../maids/maids.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';
import { Login } from './interfaces/login.interface';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly maidsService: MaidsService,
    private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() login: Login) {
    try {
      var user = await this.usersService.validateUser(login.email, login.password)
      var result = { firstname: user.firstname, lastname: user.lastname, role: user.role }
      if (user.role === "customer") {
        var customer = await this.customerService.findCustomer(login.email)
        if (customer) Object.assign(result, {g_coin: customer.g_coin});
      } else if (user.role === "maid") {
        var maid = await this.maidsService.findMaid(login.email)
        if (maid) Object.assign(result, {avgRating: maid.avgRating});
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() createUserDto: UserDto): Promise<any> {
	try {
      var user = await this.usersService.createNewUser(createUserDto);
      if (user.role === "customer") await this.customerService.createNewCustomer(user.email);
      else if (user.role === "maid") await this.maidsService.createNewMaid(user.email);
      await this.authService.createEmailToken(user.email);
      var isEmailSent = await this.authService.sendEmailVerification(user.email);
	  if (!isEmailSent) throw new UnprocessableEntityException();
      var result = { email:user.email, firstname: user.firstname, lastname: user.lastname, role: user.role }
      return result;
	} catch (error) {
      throw error;
    }
  }

  @Get('verify/:token')
  public async verifyEmail(@Param() params): Promise<boolean> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(params.token);
      return isEmailVerified;
    } catch (error) {
      throw error;
    }
  }
}