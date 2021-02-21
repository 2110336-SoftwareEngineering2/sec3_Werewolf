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
    let user = await this.usersService.findUser(email);
    if (!user) throw new UnauthorizedException('Invalid user');
    let isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if (!user.valid) throw new UnauthorizedException('Email not verified');
    let accessToken = await this.jwtService.createToken(email, user.role);
    return accessToken;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      let user = await this.usersService.createNewUser(createUserDto);
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
    let token = (await this.jwtService.createToken(email, role)).access_token;
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
    let model = await this.emailVerificationModel.findOne({ email: email });
    if (model && model.token) {
      let transporter = nodemailer.createTransport({
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
      let mailOptions = {
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
      let sent = await new Promise<boolean>(async function (resolve, reject) {
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
    let emailVerification = await this.emailVerificationModel.findOne({
      token: token,
    });
    if (emailVerification && emailVerification.email) {
      let user = await this.usersService.findUser(emailVerification.email);
      await emailVerification.remove();
      if (!user) throw new ForbiddenException('Invalid user');
      user.valid = true;
      let savedUser = await user.save();
      return !!savedUser;
    } else {
      throw new UnauthorizedException('Code not valid');
    }
  }

  async checkPassword(email: string, pass: string): Promise<boolean> {
    let user = await this.usersService.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    return await bcrypt.compare(pass, user.password);
  }

  async deleteUser(email: string, pass: string) {
    let user = await this.usersService.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    let isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if (user.role === 'customer') {
      let customer = await this.customerService.findCustomer(email);
      if (customer) await customer.remove();
    } else if (user.role === 'maid') {
      let maid = await this.maidsService.findMaid(email);
      if (maid) await maid.remove();
    }
    return await user.remove();
  }
}
