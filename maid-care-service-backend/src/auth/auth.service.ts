import { Injectable, Inject, UnauthorizedException, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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
  constructor(@Inject('EmailVerification_MODEL') private emailVerificationModel: Model<EmailVerification>,
    private jwtService: JWTService,
    private customerService: CustomerService,
    private maidsService: MaidsService,
    private usersService: UsersService) {}

  async validateLogin(email: string, pass: string) {
	var user = await this.usersService.findUser(email);
    if (!user) throw new UnauthorizedException('Invalid user');
	var isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if(!user.valid) throw new UnauthorizedException('Email not verified');
    var result = { firstname: user.firstname, lastname: user.lastname, phone: user.phone, role: user.role };
    if (user.role === "customer") {
      var customer = await this.customerService.findCustomer(email)
      if (customer) Object.assign(result, {g_coin: customer.g_coin});
    } else if (user.role === "maid") {
      var maid = await this.maidsService.findMaid(email)
      if (maid) Object.assign(result, {avgRating: maid.avgRating});
    }
    var accessToken =  await this.jwtService.createToken(email, user.role);
    return { token: accessToken, user: result};
  }
  
  async register(createUserDto: CreateUserDto) {
	try {
      var user = await this.usersService.createNewUser(createUserDto);
      if (user.role === "customer") await this.customerService.createNewCustomer(user.email);
      else if (user.role === "maid") await this.maidsService.createNewMaid(user.email);
      return user;
	} catch (error) {
      throw error;
    }
  }

  async createEmailToken(email: string): Promise<boolean> {
    while (true) {
      var token = (Math.floor(Math.random() * (9000000)) + 1000000).toString(); //Generate 7 digits number
      if (!await this.emailVerificationModel.findOne({token: token})) break;
    }
    var emailVerificationModel = await this.emailVerificationModel.findOneAndUpdate( 
      {email: email},
      { 
        email: email,
        token: token
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
        '<a href='+ process.env.SERVER_URL +'/auth/verify/'+ model.token + '>Click here to activate your account</a>'
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
      var user = await this.usersService.findUser(emailVerification.email);
      await emailVerification.remove();
      if (!user) throw new ForbiddenException('Invalid user');
      user.valid = true;
      var savedUser = await user.save();
      return !!savedUser;
    } else {
      throw new UnauthorizedException('Code not valid');
    }
  }

  async checkPassword(email: string, pass: string): Promise<boolean> {
    var user = await this.usersService.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    return await bcrypt.compare(pass, user.password);
  }

  async deleteUser(email: string, pass: string) {
    var user = await this.usersService.findUser(email);
    if (!user) throw new NotFoundException('Invalid user');
    var isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) throw new UnauthorizedException('Incorrect password');
    if (user.role === "customer") {
      var customer = await this.customerService.findCustomer(email);
      if (customer) await customer.remove();
    } else if (user.role === "maid") {
      var maid = await this.maidsService.findMaid(email);
      if (maid) await maid.remove();
    }
    return await user.remove();
  }
}