import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JWTService } from '../jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JWTService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: jwtConstants.secret,
      },
      // async (req, payload, next) => await this.verify(req, payload, next),
    );
    // passport.use(this);
  }

  public async validate(payload: any, req: any, done: Function) {
    const user = await this.jwtService.validateUser(req);
    if (!user) {
      return done(new UnauthorizedException('Invalid user'), false);
    }
    done(null, user);
  }
}
