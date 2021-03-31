import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { MaidsModule } from '../maids/maids.module';
import { NotificationModule } from '../notification/notification.module';
import { WalletModule } from '../wallet/wallet.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { WorkspacesController } from '../workspaces/workspaces.controller';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { WorkspaceProviders } from '../workspaces/workspaces.providers';
import { DatabaseModule } from '../database/database.module';
import { JobModule } from '../job/job.module';
import { JobController } from '../job/job.controller';
import { JobService } from '../job/job.service';
import { JobProviders } from '../job/job.providers';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { UsersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';
import { RefundController } from './refund.controller';
import { RefundProviders } from './refund.providers';
import { RefundService } from './refund.service';
import { PromotionModule } from '../promotion/promotion.module';

dotenv.config();

describe('RefundController', () => {
  let refundController: RefundController;
  let refundService: RefundService;
  let usersController: UsersController;
  let workspacesController: WorkspacesController;
  let jobController: JobController;
  let customerReq: any;
  let jobId: string;

  beforeAll(async () => {
    const refundModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, JobModule, UsersModule],
      controllers: [RefundController],
      providers: [RefundService, ...RefundProviders],
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

    const workspacesModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [WorkspacesController],
      providers: [WorkspacesService, ...WorkspaceProviders],
    }).compile();

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

    refundController = refundModule.get<RefundController>(RefundController);
    refundService = refundModule.get<RefundService>(RefundService);
    usersController = usersModule.get<UsersController>(UsersController);
    workspacesController = workspacesModule.get<WorkspacesController>(
      WorkspacesController,
    );
    jobController = jobModule.get<JobController>(JobController);

    // create a testing user
    const createUserDto = {
      email: 'miko@example.com',
      password: 'password',
      firstname: 'Miko',
      lastname: 'Sakura',
      birthdate: new Date(),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'customer',
      work: null,
    };
    const createdCustomer = await usersController.createUser(createUserDto);
    customerReq = { user: createdCustomer };

    // create a testing workspace
    //create testing workspaces
    const createWorkspaceDto = {
      customerId: customerReq.user._id.toString(),
      description: 'pekoland',
      latitude: 63.15353,
      longitude: 13.93456,
    };
    const workspace = await workspacesController.createWorkspace(
      createWorkspaceDto,
    );
    const workspaceId = workspace._id.toString();

    // create a testing job
    const createJobDto = {
      workplaceId: workspaceId,
      work: [],
      promotionCode: null,
    };
    const job = await jobController.createJob(customerReq, createJobDto);
    jobId = job._id;
  });

  describe('findAll', () => {
    it('return an array of refund', async () => {
      const spy = jest.spyOn(refundService, 'findAll');
      expect(await refundService.findAll()).toBeDefined();
      expect(spy).toHaveBeenCalled();
    });

    it('return an empty array when customer has no refund', async () => {
      expect(
        await refundController.findByCustomer(
          customerReq,
          customerReq.user._id,
        ),
      ).toStrictEqual([]);
    });
  });

  describe('newRefund', () => {
    const messege = 'my house is burning!';
    const photo = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=m1k3Cpke4yU',
    ];
    let refundId: string;

    it('create new refund', async () => {
      const createRefundDto = {
        jobId: jobId,
        description: messege,
        photo: photo,
      };
      // create new refund
      const newRefund = await refundController.createRefund(
        customerReq,
        createRefundDto,
      );
      newRefund.photo = Array.from(newRefund.photo);
      refundId = newRefund._id;
      expect(newRefund.createDate).toBeDefined;
      expect(newRefund.description).toBe(messege);
      expect(newRefund.photo).toStrictEqual(photo);
      expect(newRefund.customer._id).toStrictEqual(customerReq.user._id);
      expect(newRefund.job._id).toStrictEqual(jobId);

      // find refund
      const refund = await refundController.findRefund(customerReq, refundId);
      refund.photo = Array.from(refund.photo);
      expect(refund.createDate).toBeDefined;
      expect(refund.description).toBe(messege);
      expect(refund.photo).toStrictEqual(photo);
      expect(refund.customer._id).toStrictEqual(customerReq.user._id);
      expect(refund.job._id).toStrictEqual(jobId);

      expect(
        await refundController.findByCustomer(
          customerReq,
          customerReq.user._id,
        ),
      ).not.toStrictEqual([]);
    });

    it('other customer try to find your refund', async () => {
      const otherReq = {
        user: { _id: '602a73161507755ee8e094e1', role: 'customer' },
      };
      try {
        await refundController.findRefund(otherReq, refundId);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });

    it('delete refund', async () => {
      // delete refund
      const deletedRefund = await refundController.removeRefund(refundId);
      deletedRefund.photo = Array.from(deletedRefund.photo);
      expect(deletedRefund.description).toBe(messege);
      expect(deletedRefund.photo).toStrictEqual(photo);
      expect(deletedRefund.customer._id).toStrictEqual(customerReq.user._id);
      expect(deletedRefund.job._id).toStrictEqual(jobId);

      // find deleted refund
      try {
        await refundController.findRefund(customerReq, refundId);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // delete nonexistent refund
      try {
        await refundController.removeRefund(refundId);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  afterAll(async () => {
    // delete the testing user
    await usersController.deleteUser(customerReq, customerReq.user._id);
    mongoose.connection.close();
  });
});
