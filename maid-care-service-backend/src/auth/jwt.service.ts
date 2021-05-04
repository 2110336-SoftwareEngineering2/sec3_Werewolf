import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './passport/constants';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';
import { AccessTokenDto } from './dto/accessToken.dto';

@Injectable()
export class JWTService {
  constructor(private usersService: UsersService) {}

  async createToken(email, role) {
    const expiresIn = 36000000;
    const userInfo = { email: email, role: role };
    const token = jwt.sign(userInfo, jwtConstants.secret, { expiresIn });
    return new AccessTokenDto(expiresIn, token);
  }

  async validateUser(signedUser): Promise<User> {
    const userFromDb = await this.usersService.findUserByEmail(
      signedUser.email,
    );
    return userFromDb;
  }
}
