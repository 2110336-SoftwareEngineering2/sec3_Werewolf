import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';
import {default as config} from '../config';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async sendEmailVerification(email: string): Promise<boolean> {
    var emailToken = 12345678;
    if(emailToken){
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            secure: config.mail.secure, // true for 465, false for other ports
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            },
			tls: {
				rejectUnauthorized:false
			}
        });
        let mailOptions = {
          from: '"Werewolf" <' + config.mail.user + '>', 
          to: email,
          subject: 'Email Verification', 
          text: 'Email Verification', 
          html: 'Hi! <br><br> Thanks for your registration<br><br>'+
          '<p>' + emailToken + '</p>'
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
      return false;
    }
  }
}