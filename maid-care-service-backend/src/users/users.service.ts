import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CustomerService } from '../customer/customer.service';
import { MaidsService } from '../maids/maids.service';
import { JobService } from '../job/job.service';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<User>,
    private customerService: CustomerService,
    private maidsService: MaidsService,
    private jobService: JobService,
  ) {}

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findUserById(id: string): Promise<User> {
    if (String(id).length === 24) {
      return this.userModel.findOne({ _id: id }).exec();
    } else return null;
  }

  async createNewUser(newUser: CreateUserDto): Promise<User> {
    const userRegistered = await this.findUser(newUser.email);
    if (!userRegistered) {
      if (!this.isValidEmail(newUser.email))
        throw new BadRequestException('Bad email');
      if (!newUser.password) throw new BadRequestException('No password');
      if (!this.isValidRole(newUser.role))
        throw new BadRequestException(
          newUser.role +
            ' is not valid role. Role must be customer, maid or admin',
        );
      newUser.password = await bcrypt.hash(newUser.password, saltRounds);
      const createdUser = new this.userModel(newUser);
      return await createdUser.save();
    } else if (!userRegistered.valid) {
      return userRegistered;
    } else {
      throw new ConflictException('User already registered');
    }
  }

  async register(createUserDto: CreateUserDto) {
    if (createUserDto.work) {
      createUserDto.work.forEach((work) => {
        if (!this.jobService.isValidTypeOfWork(work))
          throw new BadRequestException(work + ' is not valid type of work');
      });
    }
    try {
      const user = await this.createNewUser(createUserDto);
      if (user.role === 'customer')
        await this.customerService.createNewCustomer(user._id);
      else if (user.role === 'maid') {
        await this.maidsService.createNewMaid(user._id);
        if (createUserDto.work)
          await this.maidsService.updateWork(user._id, createUserDto.work);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(id: string, newProfile: ProfileDto): Promise<User> {
    const userFromDb = await this.findUserById(id);
    if (!userFromDb) throw new ForbiddenException('Invalid user');
    if (newProfile.password) {
      newProfile.password = await bcrypt.hash(newProfile.password, saltRounds);
      userFromDb.password = newProfile.password;
    }
    if (newProfile.firstname) userFromDb.firstname = newProfile.firstname;
    if (newProfile.lastname) userFromDb.lastname = newProfile.lastname;
    if (newProfile.birthdate) userFromDb.birthdate = newProfile.birthdate;
    if (newProfile.citizenId) userFromDb.citizenId = newProfile.citizenId;
    if (newProfile.nationality) userFromDb.nationality = newProfile.nationality;
    if (newProfile.bankAccountNumber)
      userFromDb.bankAccountNumber = newProfile.bankAccountNumber;
    await userFromDb.save();
    return userFromDb;
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundException('Invalid user');
    if (user.role === 'customer') {
      const customer = await this.customerService.findCustomer(user._id);
      if (customer) {
        const jobs = await this.jobService.findByCustomer(id);
        jobs.forEach((job) => {
          job.remove();
        });
        await customer.remove();
      }
    } else if (user.role === 'maid') {
      const maid = await this.maidsService.findMaid(user._id);
      if (maid) await maid.remove();
    }
    return await user.remove();
  }

  async checkPassword(email: string, pass: string): Promise<boolean> {
    const user = await this.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    return await bcrypt.compare(pass, user.password);
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.findUser(email);
    if (!user) throw new ForbiddenException('Invalid user');
    user.password = await bcrypt.hash(newPassword, saltRounds);
    const savedUser = await user.save();
    return !!savedUser;
  }

  isValidEmail(email: string) {
    if (email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false;
  }

  isValidPhoneNumber(phone: string) {
    if (phone) {
      const phoneno = /^\d{10}$/;
      return phoneno.test(phone);
    } else return false;
  }

  isValidRole(role: string) {
    return role === 'customer' || role === 'maid' || role === 'admin';
  }
}
