import { Injectable, Inject, BadRequestException, UnauthorizedException, ForbiddenException, ConflictException  } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/users.interface';
import { Promotion } from './interfaces/promotion.interface';
import { UserDto } from './dto/user.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>,
    @Inject('PROMOTION_MODEL') private promotionModel: Model<Promotion>) {}

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({email: email}).exec();
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

  async updateProfile(userDto: UserDto): Promise<User> {
    try {
      var userFromDb = await this.validateUser(userDto.email, userDto.password);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
    if (userDto.firstname) userFromDb.firstname = userDto.firstname;
    if (userDto.lastname) userFromDb.lastname = userDto.lastname;
	if (userDto.phone ) {
      if (!this.isValidPhoneNumber(userDto.phone)) throw new BadRequestException('Bad phone number');
      userFromDb.phone = userDto.phone;
	}
    await userFromDb.save();
    return userFromDb;
  }

  async createPromotion(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    try {
      var admin = await this.validateUser(createPromotionDto.email, createPromotionDto.password);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
    if (admin.role === "admin") {
      var createdPromotion = new this.promotionModel(createPromotionDto);
      createdPromotion.creater = admin.email;
      return await createdPromotion.save();
    } else throw new UnauthorizedException('user is not admin');
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