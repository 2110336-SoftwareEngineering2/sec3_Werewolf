import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UsersService } from '../users/users.service';

dotenv.config();

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    _id: '0123456789',
    email: 'user@example.com',
    firstname: 'John',
    lastname: 'Doe',
    birthdate: new Date('2002-10-05'),
    citizenId: '1234567890123',
    bankAccountNumber: '048592317',
    profilePicture: 'profile.com/123',
    role: 'customer',
    valid: true,
  };

  const authService = {
    validateLogin: () => {
      return {
        expires_in: 36000000,
        access_token: '0123456789',
      };
    },

    createEmailToken: () => true,
    sendEmailVerification: () => true,
  };

  const usersService = {
    register: () => testUser,
    isValidRole: () => true,
    validateWork: () => true,
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
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(JwtStrategy)
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Log In', () => {
    it('TC1-1', async () => {
      const loginDto = {
        email: 'user@example.com',
        password: 'secret',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);
    });

    it('TC1-2', async () => {
      const loginDto = {
        email: 'notEmail',
        password: 'secret',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);
    });

    it('TC1-3', async () => {
      const loginDto = {
        email: 'user@example.com',
        password: '',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);
    });
  });

  describe('Create Account', () => {
    it('TC2-1', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);
    });

    it('TC2-2', async () => {
      const createUserDto = {
        email: '',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-3', async () => {
      const createUserDto = {
        email: 'notEmail',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-4', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: '',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-5', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: '',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-6', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: '',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-7', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-8', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: 'notanumber123',
        bankAccountNumber: '048592317',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-9', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: '',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-10', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: new Date('2002-10-05'),
        citizenId: '1234567890123',
        bankAccountNumber: 'notanumber123',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('TC2-11', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'secret',
        firstname: 'John',
        lastname: 'Doe',
        birthdate: 'notDate',
        citizenId: '1234567890123',
        bankAccountNumber: 'notanumber123',
        role: 'customer',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
