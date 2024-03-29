import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { DatabaseModule } from '../database/database.module';
import { JobModule } from '../job/job.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersController } from '../users/users.controller';
import { UsersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';
import { WalletModule } from '../wallet/wallet.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { MaidDto } from './dto/maid.dto';
import { MaidsController } from './maids.controller';
import { MaidsModule } from './maids.module';
import { MaidsProviders } from './maids.providers';
import { MaidsService } from './maids.service';

dotenv.config();

describe('MaidsController', () => {
  let maidController: MaidsController;
  let maidsService: MaidsService;
  let usersController: UsersController;
  let maidReq: any;
  let maidDto: any;

  beforeEach(async () => {
    const maidModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [MaidsController],
      providers: [MaidsService, ...MaidsProviders],
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

    maidController = maidModule.get<MaidsController>(MaidsController);
    maidsService = maidModule.get<MaidsService>(MaidsService);
    usersController = usersModule.get<UsersController>(UsersController);

    // create a testing user
    const work = ['House Cleaning', 'Dish Washing', 'Laundry'];
    const createUserDto = {
      email: 'aqua@example.com',
      password: 'password',
      firstname: 'Aqua',
      lastname: 'Minato',
      birthdate: new Date('1997-12-01'),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'maid',
      work: work,
    };
    const createdMaid = await usersController.createUser(createUserDto);
    maidReq = { user: createdMaid };
    // maid with default value
    maidDto = new MaidDto({
      _id: createdMaid._id,
      availability: false,
      avgRating: null,
      note: '',
      totalReviews: 0,
      work: work,
    });
  });

  describe('getMaid', () => {
    it('get maid', async () => {
      const maid = await maidController.getMaid(maidReq.user._id);
      maid.work = Array.from(maid.work);
      expect(maid).toStrictEqual(maidDto);
    });

    it('get invalid maid', async () => {
      try {
        await maidController.getMaid('invalidId');
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('updateMaid', () => {
    it('update note', async () => {
      const messege = 'こんあくあ！ 湊あくあです！';
      const updateMaidDto = { note: messege, work: null };
      maidDto.note = messege;
      const maid = await maidController.updateMaid(maidReq, updateMaidDto);
      maid.work = Array.from(maid.work);
      expect(maid).toStrictEqual(maidDto);
    });

    it('update work', async () => {
      const work = ['House Cleaning', 'Gardening'];
      const updateMaidDto = { note: null, work: work };
      maidDto.work = work;
      const maid = await maidController.updateMaid(maidReq, updateMaidDto);
      maid.work = Array.from(maid.work);
      expect(maid).toStrictEqual(maidDto);
    });

    it('update location', async () => {
      const latitude = 36.20481;
      const longitude = 138.25294;
      const locationDto = { latitude: latitude, longitude: longitude };
      const spy = jest.spyOn(maidsService, 'updateLocation');
      expect(
        await maidController.updateLocation(maidReq, locationDto),
      ).toBeTruthy();
      expect(spy).toHaveBeenCalledWith(maidReq.user._id, latitude, longitude);
    });

    it('set availability', async () => {
      // set to true
      maidDto.availability = true;
      let maid = await maidController.setAvailability(maidReq, true);
      maid.work = Array.from(maid.work);
      expect(maid).toStrictEqual(maidDto);

      // set to false
      maidDto.availability = false;
      maid = await maidController.setAvailability(maidReq, false);
      maid.work = Array.from(maid.work);
      expect(maid).toStrictEqual(maidDto);
    });

    it('get updated maid', async () => {
      const maid = await maidController.getMaid(maidReq.user._id);
      maid.work = Array.from(maid.work);
      expect(maid).toStrictEqual(maidDto);
    });
  });

  afterEach(async () => {
    // delete the testing user
    await usersController.deleteUser(maidReq, maidReq.user._id);
    mongoose.connection.close();
  });
});
