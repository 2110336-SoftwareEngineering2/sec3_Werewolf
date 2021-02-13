import { Injectable, Inject, BadRequestException, ForbiddenException  } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({email: email}).exec();
  }

  async createNewUser(newUser: UserDto): Promise<User> {
    if(this.isValidEmail(newUser.email) && newUser.password && this.isValidRole(newUser.role)){
      var userRegistered = await this.findOne(newUser.email);
      if (userRegistered) throw new ForbiddenException('User already registered');
      newUser.password = await bcrypt.hash(newUser.password, saltRounds);
      var createdUser = new this.userModel(newUser);
      return await createdUser.save();
    } else {
      throw new BadRequestException();
    }
  }

  async updateProfile(userDto: UserDto): Promise<User> {
    let userFromDb = await this.userModel.findOne({ email: userDto.email});
    if(!userFromDb) throw new ForbiddenException('Invalid user');
    if(userDto.firstname) userFromDb.firstname = userDto.firstname;
    if(userDto.lastname) userFromDb.lastname = userDto.lastname;
    await userFromDb.save();
    return userFromDb;
  }

  isValidEmail (email : string){
    if(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }

  isValidRole (role : string){
    return role === "customer" || role === "maid" || role === "admin";
  }
}
