import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { DatabaseModule } from '../database/database.module';
import { MaidsModule } from '../maids/maids.module';
import { MaidsController } from '../maids/maids.controller';
import { MaidsService } from '../maids/maids.service';
import { MaidsProviders } from '../maids/maids.providers';
import { NotificationModule } from '../notification/notification.module';
import { PromotionModule } from '../promotion/promotion.module';
import { PromotionController } from '../promotion/promotion.controller';
import { PromotionService } from '../promotion/promotion.service';
import { PromotionProviders } from '../promotion/promotion.providers';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { UsersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';
import { WalletModule } from '../wallet/wallet.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { WorkspacesController } from '../workspaces/workspaces.controller';
import { WorkspaceProviders } from '../workspaces/workspaces.providers';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { JobController } from './job.controller';
import { JobModule } from './job.module';
import { JobProviders } from './job.providers';
import { JobService } from './job.service';
import { JobDto } from './dto/job.dto';
import { WorkCost } from './workCost';
import { WorkType } from '../maids/workType';
import { JobState } from './jobState';
import { ReviewController } from '../review/review.controller';
import { ReviewService, ReviewTest } from '../review/review.service';

dotenv.config();
jest.useFakeTimers();

describe('JobController', () => {
  let jobController: JobController;
  let usersController: UsersController;
  let maidsController: MaidsController;
  let workspacesController: WorkspacesController;
  let promotionController: PromotionController;
  let reviewController: ReviewController;
  let customerReq: any;
  let maidReq: any;
  let workspaceId: string;

  const promotionCode = 'cuupmbjsvd';
  const discountRate = 15;
  const testWork = [
    {
      typeOfWork: 'House Cleaning',
      description: 'Cleaning my house',
      quantity: 5,
    },
    {
      typeOfWork: 'Dish Washing',
      description: '',
      quantity: 20,
    },
    {
      typeOfWork: 'Laundry',
      description: 'I have not done laundry in two months.',
      quantity: 25,
    },
    {
      typeOfWork: 'Gardening',
      description: 'Happy gardening!',
      quantity: 10,
    },
  ];
  const expectedCost = 2400;

  beforeAll(async () => {
    const jobModule: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        NotificationModule,
        MaidsModule,
        WorkspacesModule,
        PromotionModule,
        WalletModule,
      ],
      controllers: [JobController],
      providers: [JobService, SchedulerRegistry, ...JobProviders],
    }).compile();

    const usersModule: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        NotificationModule,
        WalletModule,
        MaidsModule,
        JobModule,
        WorkspacesModule,
      ],
      controllers: [UsersController],
      providers: [UsersService, ...UsersProviders],
    }).compile();

    const maidModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [MaidsController],
      providers: [MaidsService, ...MaidsProviders],
    }).compile();

    const workspacesModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [WorkspacesController],
      providers: [WorkspacesService, ...WorkspaceProviders],
    }).compile();

    const promotionModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [PromotionController],
      providers: [PromotionService, ...PromotionProviders],
    }).compile();

    const reviewModule: TestingModule = await Test.createTestingModule({
      imports: [JobModule, MaidsModule, UsersModule, WorkspacesModule],
      controllers: [ReviewController],
      providers: [ReviewService, ReviewTest],
    }).compile();

    jobController = jobModule.get<JobController>(JobController);
    usersController = usersModule.get<UsersController>(UsersController);
    maidsController = maidModule.get<MaidsController>(MaidsController);
    workspacesController = workspacesModule.get<WorkspacesController>(
      WorkspacesController,
    );
    promotionController = promotionModule.get<PromotionController>(
      PromotionController,
    );
    reviewController = reviewModule.get<ReviewController>(ReviewController);

    // create a testing user
    const createUserDto = {
      email: 'pekora@example.com',
      password: 'password',
      firstname: 'Pekora',
      lastname: 'Usada',
      birthdate: new Date('1909-01-12'),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'customer',
      work: null,
    };
    const createdCustomer = await usersController.createUser(createUserDto);
    customerReq = { user: createdCustomer };

    const createUser2Dto = {
      email: 'kiara@example.com',
      password: 'password',
      firstname: 'Kiara',
      lastname: 'Takanashi',
      birthdate: new Date('1997-06-06'),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'maid',
      work: ['House Cleaning', 'Dish Washing', 'Laundry', 'Gardening'],
    };
    const createdMaid = await usersController.createUser(createUser2Dto);
    maidReq = { user: createdMaid };

    // set maid availability
    maidsController.setAvailability(maidReq, true);
    const locationDto = { latitude: 62.14598, longitude: 14.29536 };
    maidsController.updateLocation(maidReq, locationDto);

    //create testing workspaces
    const createWorkspaceDto = {
      customerId: customerReq.user._id.toString(),
      description: 'pekoland',
      latitude: 62.14598,
      longitude: 14.29536,
    };
    const workspace = await workspacesController.createWorkspace(
      createWorkspaceDto,
    );
    workspaceId = workspace._id.toString();

    //create testing promotion
    const adminReq = {
      user: { _id: '602a4e322b8caf19b4c4e962', role: 'admin' },
    };
    const createPromotionDto = {
      code: promotionCode,
      description: 'test promotion code',
      discountRate: discountRate,
      availableDate: null,
      expiredDate: null,
    };
    await promotionController.createPromotion(adminReq, createPromotionDto);
  });

  describe('create&delete', () => {
    let jobDto: any;

    it('calculate cost', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };

      const preCreatedJob = await jobController.calculateCost(createJobDto);
      expect(preCreatedJob.cost).toBe(expectedCost);
      preCreatedJob.work.forEach((work) => {
        let cost: number;
        let unit: string;
        switch (work.typeOfWork) {
          case WorkType.house_cleaning: {
            cost = work.quantity * WorkCost.house_cleaningPrice;
            unit = 'ตารางเมตร';
            break;
          }
          case WorkType.dish_washing: {
            cost = work.quantity * WorkCost.dish_washingPrice;
            unit = 'จาน';
            break;
          }
          case WorkType.laundry: {
            cost = work.quantity * WorkCost.laundryPrice;
            unit = 'ตัว';
            break;
          }
          case WorkType.gardening: {
            cost = work.quantity * WorkCost.gardeningPrice;
            unit = 'ตารางเมตร';
            break;
          }
        }
        expect(work.cost).toBe(cost);
        expect(work.unit).toBe(unit);
      });
    });

    it('create new job', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };
      jobDto = new JobDto({
        acceptedTime: null,
        expiryTime: null,
        finishTime: null,
        maidId: null,
        photos: [],
        rating: 0,
        review: null,
        state: JobState.creating,
        cost: expectedCost,
        workplaceId: workspaceId,
        customerId: customerReq.user._id.toString(),
      });

      // create new job
      const newJob = await jobController.createJob(customerReq, createJobDto);
      jobDto._id = newJob._id;
      newJob.work = Array.from(newJob.work);
      newJob.photos = Array.from(newJob.photos);
      jobDto.work = newJob.work;
      expect(newJob).toStrictEqual(jobDto);

      // get created job
      const job = await jobController.findJob(jobDto._id);
      job.work = Array.from(job.work);
      job.photos = Array.from(job.photos);
      jobDto.work = job.work;
      expect(job).toStrictEqual(jobDto);
    });

    it('delete job', async () => {
      // other customer try to delete your workspace
      const otherReq = {
        user: { _id: '602a73161507755ee8e094e1', role: 'customer' },
      };
      try {
        await jobController.removeJob(otherReq, jobDto._id);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // delete the job
      const deletedJob = await jobController.removeJob(customerReq, jobDto._id);
      deletedJob.work = Array.from(deletedJob.work);
      deletedJob.photos = Array.from(deletedJob.photos);
      jobDto.work = deletedJob.work;
      expect(deletedJob).toStrictEqual(jobDto);

      // find deleted job
      try {
        await jobController.findJob(jobDto._id);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // delete nonexistent job
      try {
        await jobController.removeJob(customerReq, jobDto._id);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('applyPromotion', () => {
    let jobId: string;

    it('calculate discounted cost', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: promotionCode,
      };

      const preCreatedJob = await jobController.calculateCost(createJobDto);
      expect(preCreatedJob.cost).toBe(expectedCost * (1 - discountRate / 100));
    });

    it('create new job with promotion', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: promotionCode,
      };
      const newJob = await jobController.createJob(customerReq, createJobDto);
      jobId = newJob._id;
      expect(newJob.cost).toBe(expectedCost * (1 - discountRate / 100));
    });

    it('create job then apply promotion', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };

      // create new job
      let job = await jobController.createJob(customerReq, createJobDto);
      jobId = job._id;
      expect(job.cost).toStrictEqual(expectedCost);

      // other customer try to apply promotion
      const otherReq = {
        user: { _id: '602a73161507755ee8e094e1', role: 'customer' },
      };
      try {
        await jobController.applyPromotion(otherReq, jobId, promotionCode);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // apply promotion
      job = await jobController.applyPromotion(
        customerReq,
        jobId,
        promotionCode,
      );
      expect(job.cost).toBe(expectedCost * (1 - discountRate / 100));

      // reapply promotion, cost must not change
      job = await jobController.applyPromotion(
        customerReq,
        jobId,
        promotionCode,
      );
      expect(job.cost).toBe(expectedCost * (1 - discountRate / 100));
    });
  });

  describe('findByMaid', () => {
    it('return an empty array when maid has no job', async () => {
      expect(await jobController.findByMaid(maidReq.user._id)).toStrictEqual(
        [],
      );
    });
  });

  describe('accept&finish', () => {
    let jobId: string;
    let nearestMaidReq: any;

    it('maid accept job', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };
      // create new job
      let job = await jobController.createJob(customerReq, createJobDto);
      jobId = job._id;
      expect(job.state).toStrictEqual(JobState.creating);

      // find maid
      job = await jobController.findMaid(customerReq, jobId);
      expect(job.state).toBe(JobState.posted);

      // maid see job
      while (job.maidId === null) {
        job = await jobController.findJob(jobId);
      }
      nearestMaidReq = {
        user: { _id: job.maidId, role: 'maid' },
      };
      expect(
        await jobController.findByMaid(nearestMaidReq.user._id),
      ).not.toStrictEqual([]);

      // maid accept
      expect(job.acceptedTime).toBeNull();
      job = await jobController.accept(nearestMaidReq, jobId);
      expect(job.state).toBe(JobState.matched);
      expect(job.acceptedTime).not.toBeNull();

      // maid availability must be false
      const nearestMaid = await maidsController.getMaid(
        nearestMaidReq.user._id,
      );
      expect(nearestMaid.availability).toBeFalsy();
    });

    it('customer confirm', async () => {
      const job = await jobController.confirm(customerReq, jobId);
      expect(job.state).toBe(JobState.confirmed);
      expect(job.finishTime).toBeNull();
    });

    it('maid finish job', async () => {
      const job = await jobController.jobDone(nearestMaidReq, jobId);
      expect(job.state).toBe(JobState.done);
      expect(job.finishTime).not.toBeNull();

      // maid availability must be true
      const nearestMaid = await maidsController.getMaid(
        nearestMaidReq.user._id,
      );
      expect(nearestMaid.availability).toBeTruthy();
    });

    it('maid post photos', async () => {
      const firstPhotoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const secondPhotoUrl = 'https://www.youtube.com/watch?v=m1k3Cpke4yU';
      const firstPhotoDto = { jobId: jobId, url: firstPhotoUrl };
      const secondPhotoDto = { jobId: jobId, url: secondPhotoUrl };

      // other customer try to apply promotion
      const otherReq = {
        user: { _id: '602a73161507755ee8e094e1', role: 'customer' },
      };
      try {
        await jobController.addPhoto(otherReq, firstPhotoDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // post first photo
      let job = await jobController.addPhoto(nearestMaidReq, firstPhotoDto);
      job.photos = Array.from(job.photos);
      expect(job.photos).toStrictEqual([firstPhotoUrl]);

      // post second photo
      job = await jobController.addPhoto(nearestMaidReq, secondPhotoDto);
      job.photos = Array.from(job.photos);
      expect(job.photos).toStrictEqual([firstPhotoUrl, secondPhotoUrl]);

      // post duplicate photo
      job = await jobController.addPhoto(nearestMaidReq, firstPhotoDto);
      job.photos = Array.from(job.photos);
      expect(job.photos).toStrictEqual([firstPhotoUrl, secondPhotoUrl]);

      // delete first photo
      job = await jobController.deletePhoto(nearestMaidReq, firstPhotoDto);
      job.photos = Array.from(job.photos);
      expect(job.photos).toStrictEqual([secondPhotoUrl]);
    });

    it('customer write review', async () => {
      const rating = 3.5;
      const messege = 'すばらしい';
      const reviewDto = {
        rating: rating,
        reviewDescription: messege,
        jobId: jobId,
        maidId: nearestMaidReq.user._id,
      };

      // save maid's old rating
      let nearestMaid = await maidsController.getMaid(nearestMaidReq.user._id);
      const oldRating = nearestMaid.avgRating;
      const totalReviews = nearestMaid.totalReviews;

      // other customer try to write review
      const otherReq = {
        user: { _id: '602a73161507755ee8e094e1', role: 'customer' },
      };
      try {
        await reviewController.updateJobReview(otherReq, reviewDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // write review
      let reviewedJob = await reviewController.updateJobReview(
        customerReq,
        reviewDto,
      );
      expect(reviewedJob.state).toBe(JobState.reviewed);
      expect(reviewedJob.rating).toBe(rating);
      expect(reviewedJob.review).toBe(messege);

      // get job
      reviewedJob = await jobController.findJob(jobId);
      expect(reviewedJob.state).toBe(JobState.reviewed);
      expect(reviewedJob.maidId).toBe(nearestMaidReq.user._id);
      expect(reviewedJob.rating).toBe(rating);
      expect(reviewedJob.review).toBe(messege);

      // maid rating should be updated
      nearestMaid = await maidsController.getMaid(nearestMaidReq.user._id);
      expect(nearestMaid.avgRating).toBe(
        (totalReviews * oldRating + rating) / (totalReviews + 1),
      );
      expect(nearestMaid.totalReviews).toBe(totalReviews + 1);

      // try to write review again
      try {
        await reviewController.updateJobReview(customerReq, reviewDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('rejectJob', () => {
    it('every maids reject the job', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };
      // create new job
      let job = await jobController.createJob(customerReq, createJobDto);
      const jobId = job._id;

      // find maid
      await jobController.findMaid(customerReq, jobId);

      // every maid reject job
      try {
        while (true) {
          job = await jobController.findJob(jobId);
          expect(job.state).toBe(JobState.posted);
          if (job.maidId !== null) {
            const nearestMaidReq = {
              user: { _id: job.maidId, role: 'maid' },
            };
            await jobController.reject(nearestMaidReq, jobId);
          }
        }
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });

    it('every maids ignore the job', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };
      // create new job
      let job = await jobController.createJob(customerReq, createJobDto);
      const jobId = job._id;

      // find maid
      await jobController.findMaid(customerReq, jobId);

      // every maid ignore job
      try {
        while (true) {
          job = await jobController.findJob(jobId);
          expect(job.state).toBe(JobState.posted);
          jest.advanceTimersByTime(60000);
        }
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('maidCancel', () => {
    let jobId: string;
    let nearestMaidReq: any;

    it('maid accept job', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };
      // create new job
      let job = await jobController.createJob(customerReq, createJobDto);
      jobId = job._id;
      expect(job.state).toStrictEqual(JobState.creating);

      // find maid
      job = await jobController.findMaid(customerReq, jobId);
      expect(job.state).toBe(JobState.posted);

      // maid see job
      while (job.maidId === null) {
        job = await jobController.findJob(jobId);
      }
      nearestMaidReq = {
        user: { _id: job.maidId, role: 'maid' },
      };
      expect(
        await jobController.findByMaid(nearestMaidReq.user._id),
      ).not.toStrictEqual([]);

      // maid accept
      expect(job.acceptedTime).toBeNull();
      job = await jobController.accept(nearestMaidReq, jobId);
      expect(job.state).toBe(JobState.matched);
      expect(job.acceptedTime).not.toBeNull();

      // maid availability must be false
      const nearestMaid = await maidsController.getMaid(
        nearestMaidReq.user._id,
      );
      expect(nearestMaid.availability).toBeFalsy();
    });

    it('auto confirm', async () => {
      jest.advanceTimersByTime(60000);
      let job = await jobController.findJob(jobId);
      while (job.state !== JobState.confirmed) {
        job = await jobController.findJob(jobId);
        expect(job).not.toBeNull();
      }
    });

    it('maid cancel job', async () => {
      // save maid's old rating
      let nearestMaid = await maidsController.getMaid(nearestMaidReq.user._id);
      const oldRating = nearestMaid.avgRating;
      const totalReviews = nearestMaid.totalReviews;

      // maid cancel
      let canceledJob = await jobController.jobMaidCancel(
        nearestMaidReq,
        jobId,
      );
      expect(canceledJob.state).toBe(JobState.canceled);
      expect(canceledJob.rating).toBe(1);
      expect(canceledJob.review).toBe('This job was canceled by maid');

      // get job
      canceledJob = await jobController.findJob(jobId);
      expect(canceledJob.state).toBe(JobState.canceled);
      expect(canceledJob.maidId).toBe(nearestMaidReq.user._id);
      expect(canceledJob.finishTime).toBeNull();
      expect(canceledJob.rating).toBe(1);
      expect(canceledJob.review).toBe('This job was canceled by maid');

      // maid rating should be updated
      nearestMaid = await maidsController.getMaid(nearestMaidReq.user._id);
      expect(nearestMaid.availability).toBeTruthy();
      expect(nearestMaid.avgRating).toBe(
        (totalReviews * oldRating + 1) / (totalReviews + 1),
      );
      expect(nearestMaid.totalReviews).toBe(totalReviews + 1);
    });
  });

  describe('customerCancel', () => {
    let jobId: string;
    let nearestMaidReq: any;

    it('maid accept job', async () => {
      const createJobDto = {
        workplaceId: workspaceId,
        work: testWork,
        promotionCode: null,
      };
      // create new job
      let job = await jobController.createJob(customerReq, createJobDto);
      jobId = job._id;
      expect(job.state).toStrictEqual(JobState.creating);

      // find maid
      job = await jobController.findMaid(customerReq, jobId);
      expect(job.state).toBe(JobState.posted);

      // maid see job
      while (job.maidId === null) {
        job = await jobController.findJob(jobId);
      }
      nearestMaidReq = {
        user: { _id: job.maidId, role: 'maid' },
      };
      expect(
        await jobController.findByMaid(nearestMaidReq.user._id),
      ).not.toStrictEqual([]);

      // maid accept
      expect(job.acceptedTime).toBeNull();
      job = await jobController.accept(nearestMaidReq, jobId);
      expect(job.state).toBe(JobState.matched);
      expect(job.acceptedTime).not.toBeNull();

      // maid availability must be false
      const nearestMaid = await maidsController.getMaid(
        nearestMaidReq.user._id,
      );
      expect(nearestMaid.availability).toBeFalsy();
    });

    it('customer cancel the job', async () => {
      // customer cancel
      let canceledJob = await jobController.cancel(customerReq, jobId);
      expect(canceledJob.state).toBe(JobState.canceled);
      expect(canceledJob.review).toBeNull();

      // get job
      canceledJob = await jobController.findJob(jobId);
      expect(canceledJob.state).toBe(JobState.canceled);
      expect(canceledJob.maidId).toBe(nearestMaidReq.user._id);
      expect(canceledJob.finishTime).toBeNull();
      expect(canceledJob.review).toBeNull();
    });
  });

  afterAll(async () => {
    // delete the testing user
    await usersController.deleteUser(customerReq, customerReq.user._id);
    await usersController.deleteUser(maidReq, maidReq.user._id);
    // delete promotion
    await promotionController.removePromotion(promotionCode);
    mongoose.connection.close();
    jest.runAllTimers();
  });
});
