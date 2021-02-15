import { Injectable, Inject, BadRequestException, ForbiddenException, ConflictException  } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({email: email}).exec();
  }

  async createNewUser(newUser: CreateUserDto): Promise<User> {
    var userRegistered = await this.findUser(newUser.email);
    if (!userRegistered) {
      if (!this.isValidEmail(newUser.email)) throw new BadRequestException('Bad email');
      if (!newUser.password) throw new BadRequestException('No password');
      if (newUser.phone && !this.isValidPhoneNumber(newUser.phone)) throw new BadRequestException('Bad phone number');
      if (!this.isValidRole(newUser.role)) throw new BadRequestException('Invalid role');
      newUser.password = await bcrypt.hash(newUser.password, saltRounds);
      var createdUser = new this.userModel(newUser);
      return await createdUser.save();
    } else if (!userRegistered.valid) {
      return userRegistered;
    } else {
      throw new ConflictException('User already registered');
    }
  }

  async updateProfile(email: string, newProfile: ProfileDto): Promise<User> {
    var userFromDb = await this.findUser(email);
    if (!userFromDb)  throw new ForbiddenException('Invalid user');
    if (newProfile.firstname) userFromDb.firstname = newProfile.firstname;
    if (newProfile.lastname) userFromDb.lastname = newProfile.lastname;
	if (newProfile.phone ) {
      if (!this.isValidPhoneNumber(newProfile.phone)) throw new BadRequestException('Bad phone number');
      userFromDb.phone = newProfile.phone;
	}
    await userFromDb.save();
    return userFromDb;
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    var user = await this.findUser(email);
    if (!user) throw new ForbiddenException('Invalid user');
    user.password = await bcrypt.hash(newPassword, saltRounds);
    var savedUser = await user.save();
    return !!savedUser;
  }

  isValidEmail(email : string){
    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false
  }
  
  isValidPhoneNumber(phone : string){
	if (phone) {
      var phoneno = /^\d{10}$/;
      return phoneno.test(phone);
    } else return false
  }

  isValidRole(role : string){
    return role === "customer" || role === "maid" || role === "admin";
  }
}