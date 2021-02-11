import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
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

  async createNewUser(newUser: CreateUserDto): Promise<boolean> {
    if(this.isValidEmail(newUser.email) && newUser.password){
      var userRegistered = await this.findOne(newUser.email);
      if(!userRegistered){
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        var createdUser = new this.userModel(newUser);
        await createdUser.save();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isValidEmail (email : string){
    if(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }
}
