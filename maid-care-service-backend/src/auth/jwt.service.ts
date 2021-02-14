import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class JWTService {
  constructor(private usersService: UsersService) {}

  async createToken(email, role) {
    const expiresIn = 36000000,
      secretOrKey = "secret";
    const userInfo = { email: email, roles: [role]};
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<User> {
    var userFromDb = await this.usersService.findUser(signedUser.email);
    if (userFromDb) {
        return userFromDb;
    }
    return null;
  }
}