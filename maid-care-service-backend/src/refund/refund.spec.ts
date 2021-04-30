import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RefundModule } from './refund.module';
import { RefundService } from './refund.service';

dotenv.config();

describe('RefundController (e2e)', () => {
  let app: INestApplication;

  const refundService = {
    createRefund: () => {
      return {
        customerId: '0123456789',
        jobId: '0123456789',
        description: 'I want my money back',
        photo: [],
        createDate: new Date(),
      };
    },
    makeRefundDto: () => {
      return {
        _id: '0123456789',
        description: 'I want my money back',
        photo: [],
        createDate: new Date(),
        customer: null,
        job: null,
      };
    },
  };

  const MockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = {
        _id: '0123456789',
        email: 'fubuki@example.com',
        firstname: 'Fubuki',
        lastname: 'Shirakami',
        birthdate: new Date('2002-10-05'),
        citizenId: '1100123456789',
        bankAccountNumber: '1234567890',
        profilePicture: 'profile.com/123',
        role: 'customer',
        valid: true,
      };
      return true;
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RefundModule],
    })
      .overrideProvider(RefundService)
      .useValue(refundService)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Request Refund', () => {
    it('TC8-1', async () => {
      const createRefundDto = {
        jobId: '0123456789',
        description: 'I want my money back',
      };

      return request(app.getHttpServer())
        .post('/refund/')
        .send(createRefundDto)
        .expect(201);
    });

    it('TC8-2', async () => {
      const createRefundDto = {
        jobId: '0123456789',
        description: null,
      };

      return request(app.getHttpServer())
        .post('/refund/')
        .send(createRefundDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
