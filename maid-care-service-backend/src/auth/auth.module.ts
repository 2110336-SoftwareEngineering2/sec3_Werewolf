import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { EmailVerificationProviders } from './emailverification.providers';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SchedulerRegistry,
    JWTService,
    JwtStrategy,
    ...EmailVerificationProviders,
  ],
})
export class AuthModule {}
