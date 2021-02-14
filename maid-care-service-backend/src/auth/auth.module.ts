import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
    ...EmailVerificationProviders
  ]
})
export class AuthModule {}