import {
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Model } from 'mongoose';
import { JWTService } from './jwt.service';
import { CustomerService } from '../customer/customer.service';
import { MaidsService } from '../maids/maids.service';
import { UsersService } from '../users/users.service';
import { EmailVerification } from './interfaces/emailverification.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('EmailVerification_MODEL')
    private emailVerificationModel: Model<EmailVerification>,
    private jwtService: JWTService,
    private customerService: CustomerService,
    private maidsService: MaidsService,
    private usersService: UsersService,
  ) {}

  async validateLogin(email: string, pass: string) {
    const user = await this.usersService.findUser(email);
    if (!user) throw new UnauthorizedException('Invalid user');
    const isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if (!user.valid) throw new UnauthorizedException('Email not verified');
    const accessToken = await this.jwtService.createToken(email, user.role);
    return accessToken;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createNewUser(createUserDto);
      if (user.role === 'customer')
        await this.customerService.createNewCustomer(user.email);
      else if (user.role === 'maid')
        await this.maidsService.createNewMaid(user.email);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createEmailToken(email: string, role: string): Promise<boolean> {
    const token = (await this.jwtService.createToken(email, role)).access_token;
    await this.emailVerificationModel.findOneAndUpdate(
      { email: email },
      {
        email: email,
        token: token,
      },
      { upsert: true },
    );
    return true;
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    const model = await this.emailVerificationModel.findOne({ email: email });
    if (model && model.token) {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: '"Werewolf" <' + process.env.MAIL_USERNAME + '>',
        to: email,
        subject: 'Email Verification',
        text: 'Email Verification',
        html:
          'Hello! <br><br> Thanks for your registration<br><br>' +
          '<a href=' +
          process.env.SERVER_URL +
          '/auth/verify/' +
          model.token +
          '>Click here to activate your account</a>',
      };
      const sent = await new Promise<boolean>(async function (resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(true);
        });
      });
      return sent;
    } else {
      throw new UnprocessableEntityException();
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerification = await this.emailVerificationModel.findOne({
      token: token,
    });
    if (emailVerification && emailVerification.email) {
      const user = await this.usersService.findUser(emailVerification.email);
      await emailVerification.remove();
      if (!user) throw new ForbiddenException('Invalid user');
      user.valid = true;
      const savedUser = await user.save();
      return !!savedUser;
    } else {
      throw new UnauthorizedException('Code not valid');
    }
  }

  async checkPassword(email: string, pass: string): Promise<boolean> {
    const user = await this.usersService.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    return await bcrypt.compare(pass, user.password);
  }

  async deleteUser(email: string, pass: string) {
    const user = await this.usersService.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    const isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if (user.role === 'customer') {
      const customer = await this.customerService.findCustomer(email);
      if (customer) await customer.remove();
    } else if (user.role === 'maid') {
      const maid = await this.maidsService.findMaid(email);
      if (maid) await maid.remove();
    }
    return await user.remove();
  }
}
