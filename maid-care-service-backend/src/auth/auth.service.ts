import { Injectable, Inject, UnauthorizedException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { UsersService } from '../users/users.service';
import { EmailVerification } from './interfaces/emailverification.interface';

@Injectable()
export class AuthService {
  constructor(@Inject('EmailVerification_MODEL') private emailVerificationModel: Model<EmailVerification>,
    private usersService: UsersService) {}

  async createEmailToken(email: string): Promise<boolean> {
    var emailVerificationModel = await this.emailVerificationModel.findOneAndUpdate( 
      {email: email},
      { 
        email: email,
        token: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number
      },
      {upsert: true}
    );
    return true;
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    var model = await this.emailVerificationModel.findOne({ email: email});
    if (model && model.token) {
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized:false
        }
      });
      let mailOptions = {
        from: '"Werewolf" <' + process.env.MAIL_USERNAME + '>', 
        to: email,
        subject: 'Email Verification', 
        text: 'Email Verification', 
        html: 'Hello! <br><br> Thanks for your registration<br><br>'+
        '<a href='+ process.env.SERVER_URL + ':' + process.env.SERVER_PORT +'/auth/verify/'+ model.token + '>Click here to activate your account</a>'
      };
      var sent = await new Promise<boolean>(async function(resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {      
            console.log('Message sent: %s', error);
            return reject(false);
          }
          console.log('Message sent: %s', info.messageId);
          resolve(true);
        });    
      })
      return sent;
    } else {
      throw new UnprocessableEntityException();
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    var emailVerification = await this.emailVerificationModel.findOne({token: token});
    if(emailVerification && emailVerification.email){
      var userFromDb = await this.usersService.findUser(emailVerification.email);
      if (userFromDb) {
        userFromDb.valid = true;
        var savedUser = await userFromDb.save();
        await emailVerification.remove();
        return !!savedUser;
      } else {
        await emailVerification.remove();
        throw new ForbiddenException('Invalid user');
      }
    } else {
      throw new UnauthorizedException('Code not valid');
    }
  }
}