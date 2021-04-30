import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

dotenv.config();

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    _id: '0123456789',
    email: 'user@example.com',
    firstname: 'ธนาธร',
    lastname: 'จึงรุ่งเรืองกิจ',
    birthdate: new Date('2000-05-19'),
    citizenId: '1111111111111',
    bankAccountNumber: '1111111111',
    profilePicture: 'https://www.profile.com/123',
    role: 'customer',
    valid: true,
  };

  const usersService = {
    findUser: () => testUser,
    updateProfile: () => testUser,
  };

  const MockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = testUser;
      return true;
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Edit Account', () => {
    it('TC5-1', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: '1111111111111',
        bankAccountNumber: '1111111111',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(200);
    });

    it('TC5-2', async () => {
      const profileDto = {
        firstname: '',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: '1111111111111',
        bankAccountNumber: '1111111111',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-3', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: '',
        birthdate: new Date('2000-05-19'),
        citizenId: '1111111111111',
        bankAccountNumber: '1111111111',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-4', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: '',
        bankAccountNumber: '1111111111',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-5', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: 'abcdefg',
        bankAccountNumber: '1111111111',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-6', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: '1111111111111',
        bankAccountNumber: '',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-7', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: '1111111111111',
        bankAccountNumber: 'abcdefg',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-8', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: 'abcdefg',
        citizenId: '1111111111111',
        bankAccountNumber: '1111111111',
        profilePicture: 'profile.com/123',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });

    it('TC5-9', async () => {
      const profileDto = {
        firstname: 'ธนาธร',
        lastname: 'จึงรุ่งเรืองกิจ',
        birthdate: new Date('2000-05-19'),
        citizenId: '1111111111111',
        bankAccountNumber: '1111111111',
        profilePicture: 'abcdefg',
      };

      return request(app.getHttpServer())
        .put('/users/update-profile')
        .send(profileDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
