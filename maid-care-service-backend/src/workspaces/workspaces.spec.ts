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
import { WorkspacesModule } from './workspaces.module';
import { WorkspacesService } from './workspaces.service';

dotenv.config();

describe('WorkspacesController (e2e)', () => {
  let app: INestApplication;

  const workspacesService = {
    addNewWorkspace: () => {
      return {
        _id: '0123456789',
        note: 'my note',
        work: ['House Cleaning', 'Dish Washing', 'Laundry'],
        cerrentLocation: {
          latitude: 0,
          longitude: 0,
        },
        availability: true,
        avgRating: 4,
        totalReviews: 2,
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
      imports: [WorkspacesModule],
    })
      .overrideProvider(WorkspacesService)
      .useValue(workspacesService)
      .overrideGuard(JwtAuthGuard)
      .useValue(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Rate and Review', () => {
    it('TC4-1', async () => {
      const createWorkspaceDto = {
        customerId: '0123456789',
        description: 'My house',
        latitude: 36.2048,
        longitude: 138.2529,
      };

      return request(app.getHttpServer())
        .post('/workspaces/')
        .send(createWorkspaceDto)
        .expect(201);
    });

    it('TC4-2', async () => {
      const createWorkspaceDto = {
        customerId: '0123456789',
        description: '',
        latitude: 36.2048,
        longitude: 138.2529,
      };

      return request(app.getHttpServer())
        .post('/workspaces/')
        .send(createWorkspaceDto)
        .expect(400);
    });

    it('TC4-3', async () => {
      const createWorkspaceDto = {
        customerId: '0123456789',
        description: 'My house',
        latitude: null,
        longitude: 138.2529,
      };

      return request(app.getHttpServer())
        .post('/workspaces/')
        .send(createWorkspaceDto)
        .expect(400);
    });

    it('TC4-4', async () => {
      const createWorkspaceDto = {
        customerId: '0123456789',
        description: 'My house',
        latitude: 36.2048,
        longitude: null,
      };

      return request(app.getHttpServer())
        .post('/workspaces/')
        .send(createWorkspaceDto)
        .expect(400);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
    await app.close();
  });
});
