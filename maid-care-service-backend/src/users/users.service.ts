import { Injectable, Inject, BadRequestException, UnauthorizedException, ForbiddenException, ConflictException  } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Maid } from './interfaces/maids.interface';
import { User } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @Inject('MAID_MODEL') private maidModel: Model<Maid>,
    @Inject('USER_MODEL') private userModel: Model<User>
  ) {}

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({email: email}).exec();
  }

  async findMaid(email: string): Promise<Maid> {
    return this.maidModel.findOne({email: email}).exec();
  }

  async validateUser(email: string, pass: string): Promise<User> {
    var user = await this.findUser(email);
    if (!user) throw new UnauthorizedException('Invalid user');
    var isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if(!user.valid) throw new UnauthorizedException('Email not verified');
    return user;
  }

  async createNewUser(newUser: UserDto): Promise<User> {
    if(this.isValidEmail(newUser.email) && newUser.password && this.isValidRole(newUser.role)){
      var userRegistered = await this.findUser(newUser.email);
      if (!userRegistered) {
        if (newUser.role === "maid") {
          var createdMaid = new this.maidModel(newUser);
          await createdMaid.save();
        }
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        var createdUser = new this.userModel(newUser);
        return await createdUser.save();
      } else if (!userRegistered.valid) {
        return userRegistered;
      } else {
        throw new ConflictException('User already registered');
      }
    } else {
      throw new BadRequestException();
    }
  }

  async updateProfile(userDto: UserDto): Promise<User> {
    try {
      var userFromDb = await this.validateUser(userDto.email, userDto.password)
    } catch (error) {
      throw new ForbiddenException('Invalid user');
    }
    if (userDto.firstname) userFromDb.firstname = userDto.firstname;
    if (userDto.lastname) userFromDb.lastname = userDto.lastname;
    await userFromDb.save();
    return userFromDb;
  }

  isValidEmail (email : string){
    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }

  isValidRole (role : string){
    return role === "customer" || role === "maid" || role === "admin";
  }
}