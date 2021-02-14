import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('update-profile')
  async updateProfile(@Body() userDto: UserDto):Promise<any> {
    try {
      var user =  await this.usersService.updateProfile(userDto);
      var result = { firstname: user.firstname, lastname: user.lastname, phone: user.phone }
      return result;
    } catch (error) {
      throw error;
    }
  }
}