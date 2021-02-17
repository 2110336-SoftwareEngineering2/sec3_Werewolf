import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { EmailVerificationProviders } from './emailverification.providers';
import { DatabaseModule } from '../database/database.module';
import { CustomerModule } from '../customer/customer.module';
import { MaidsModule } from '../maids/maids.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, CustomerModule, MaidsModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTService,
    JwtStrategy,
    ...EmailVerificationProviders,
  ],
})
export class AuthModule {}
