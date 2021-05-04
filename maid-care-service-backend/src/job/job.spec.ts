import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { JobModule } from './job.module';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

dotenv.config();

describe('JobController (e2e)', () => {
  let app: INestApplication;

  const jobService = {
    createJob: () => {
      return {
        _id: '0123456789',
        customerId: '0123456789',
        workplaceId: '0123456789',
        work: [
          {
            typeOfWork: 'House Cleaning',
            description: '',
            quantity: 10,
            unit: 'ตารางเมตร',
            cost: 1000,
          },
        ],
        cost: 1000,
        maidId: null,
        requestedMaid: [],
        expiryTime: null,
        state: 'creating',
        rating: 0,
        review: null,
        photos: [],
        acceptedTime: null,
        finishTime: null,
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
      imports: [JobModule],
    })
      .overrideProvider(JobService)
      .useValue(jobService)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Post Job', () => {
    it('TC6-1', async () => {
      const createJobDto = {
        workplaceId: '0123456789',
        work: [
          {
            typeOfWork: 'House Cleaning',
            quantity: 10,
          },
        ],
        promotionCode: 'GSIMPTQ125',
      };

      return request(app.getHttpServer())
        .post('/job/')
        .send(createJobDto)
        .expect(201);
    });

    it('TC6-2', async () => {
      const createJobDto = {
        workplaceId: '0123456789',
        work: [
          {
            typeOfWork: 'House Cleaning',
            quantity: null,
          },
        ],
        promotionCode: 'GSIMPTQ125',
      };

      return request(app.getHttpServer())
        .post('/job/')
        .send(createJobDto)
        .expect(400);
    });

    it('TC6-3', async () => {
      const createJobDto = {
        workplaceId: '0123456789',
        work: [
          {
            typeOfWork: 'House Cleaning',
            quantity: -1,
          },
        ],
        promotionCode: 'GSIMPTQ125',
      };

      return request(app.getHttpServer())
        .post('/job/')
        .send(createJobDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
