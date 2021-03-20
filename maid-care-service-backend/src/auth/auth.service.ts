import {
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { JWTService } from './jwt.service';
import { UsersService } from '../users/users.service';
import { EmailVerification } from './interfaces/emailverification.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('EmailVerification_MODEL')
    private emailVerificationModel: Model<EmailVerification>,
    private schedulerRegistry: SchedulerRegistry,
    private jwtService: JWTService,
    private usersService: UsersService,
  ) {}

  async validateLogin(email: string, pass: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid user');
    const isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if (!user.valid) throw new UnauthorizedException('Email not verified');
    const accessToken = await this.jwtService.createToken(email, user.role);
    return accessToken;
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
          // process.env.FRONTEND_URL +
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
      throw new ForbiddenException('can not find token');
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerification = await this.emailVerificationModel.findOne({
      token: token,
    });
    if (emailVerification && emailVerification.email) {
      const user = await this.usersService.findUserByEmail(
        emailVerification.email,
      );
      // remove the email verification token in 5 minutes
      this.addTimeout(emailVerification, 300000);
      // validate user
      if (!user) throw new ForbiddenException('invalid user');
      user.valid = true;
      const savedUser = await user.save();
      return !!savedUser;
    } else {
      throw new UnauthorizedException('token not valid');
    }
  }

  addTimeout(emailVerification: EmailVerification, milliseconds: number) {
    const callback = () => {
      // remove the email verification token
      emailVerification.remove();
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(emailVerification._id, timeout);
  }
}
