import { Test } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { ReviewModule } from './review.module';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { JobService } from '../job/job.service';

dotenv.config();

describe('ReviewController (e2e)', () => {
  let app: INestApplication;

  const reviewService = {
    updateMaidRating: () => {
      return {
        _id: '0123456789',
        note: 'my note',
        work: ['House Cleaning', 'Dish Washing', 'Laundry'],
        cerrentLocation: {
          latitude: 13.736717,
          longitude: 100.523186,
        },
        availability: true,
        avgRating: 4,
        totalReviews: 2,
      };
    },
    updateJobReview: () => {
      return {
        _id: '0123456789',
        customerId: '0123456789',
        workplaceId: '0123456789',
        work: [],
        cost: 0,
        maidId: '0123456789',
        requestedMaid: ['0123456789'],
        expiryTime: new Date(),
        state: 'reviewed',
        rating: 5,
        review: 'Cool!',
        photos: [],
        acceptedTime: new Date(),
        finishTime: new Date(),
      };
    },
  };

  const jobService = {
    checkUserWithJob: () => true,
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
      imports: [ReviewModule],
    })
      .overrideProvider(ReviewService)
      .useValue(reviewService)
      .overrideProvider(JobService)
      .useValue(jobService)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Rate and Review', () => {
    it('TC7-1', async () => {
      const reviewDto = {
        rating: '5',
        reviewDescription: 'Cool!',
        jobId: 'testJobId',
        maidId: 'testMaidId',
      };

      return request(app.getHttpServer())
        .put('/review/')
        .send(reviewDto)
        .expect(200);
    });

    it('TC7-2', async () => {
      const reviewDto = {
        rating: '6',
        reviewDescription: 'Amazing!',
        jobId: '0123456789',
        maidId: '0123456789',
      };

      return request(app.getHttpServer())
        .put('/review/')
        .send(reviewDto)
        .expect(400);
    });

    it('TC7-3', async () => {
      const reviewDto = {
        rating: '-1',
        reviewDescription: 'Too Bad',
        jobId: '0123456789',
        maidId: '0123456789',
      };

      return request(app.getHttpServer())
        .put('/review/')
        .send(reviewDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
