import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import MockDate from 'mockdate';
import { PromotionModule } from './promotion.module';
import { PromotionService } from './promotion.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

dotenv.config();

describe('PromotionController (e2e)', () => {
  let app: INestApplication;

  const promotionService = {
    createPromotion: () => {
      return {
        code: 'GSIMPTQ125',
        creater: '0123456789',
        description: 'description',
        discountRate: 20,
        availableDate: new Date('2020-04-24'),
        expiredDate: new Date('2020-06-20'),
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
        role: 'admin',
        valid: true,
      };
      return true;
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PromotionModule],
    })
      .overrideProvider(PromotionService)
      .useValue(promotionService)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Add Promotion', () => {
    MockDate.set('2020-04-23');

    it('TC3-1', async () => {
      const createPromotionDto = {
        code: 'GSIMPTQ125',
        description: 'description',
        discountRate: 20,
        availableDate: new Date('2020-04-23'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(201);
    });

    it('TC3-2', async () => {
      const createPromotionDto = {
        code: '',
        description: 'description',
        discountRate: 20,
        availableDate: new Date('2020-04-23'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(400);
    });

    it('TC3-3', async () => {
      const createPromotionDto = {
        code: 'GSIMPTQ125',
        description: 'description',
        discountRate: null,
        availableDate: new Date('2020-04-23'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(400);
    });

    it('TC3-4', async () => {
      const createPromotionDto = {
        code: 'GSIMPTQ125',
        description: 'description',
        discountRate: 101,
        availableDate: new Date('2020-04-23'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(400);
    });

    it('TC3-5', async () => {
      const createPromotionDto = {
        code: 'GSIMPTQ125',
        description: 'description',
        discountRate: -1,
        availableDate: new Date('2020-04-23'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(400);
    });

    it('TC3-6', async () => {
      const createPromotionDto = {
        code: 'GSIMPTQ125',
        description: 'description',
        discountRate: 20,
        availableDate: new Date('2020-04-22'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(400);
    });

    it('TC3-7', async () => {
      const createPromotionDto = {
        code: 'GSIMPTQ125',
        description: 'description',
        discountRate: 20,
        availableDate: new Date('2020-06-21'),
        expiredDate: new Date('2020-06-20'),
      };

      return request(app.getHttpServer())
        .post('/promotion/')
        .send(createPromotionDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
