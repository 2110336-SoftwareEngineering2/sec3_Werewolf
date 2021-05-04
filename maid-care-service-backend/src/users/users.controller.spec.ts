import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { DatabaseModule } from '../database/database.module';
import { JobModule } from '../job/job.module';
import { MaidsModule } from '../maids/maids.module';
import { NotificationModule } from '../notification/notification.module';
import { WalletModule } from '../wallet/wallet.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { UserDto } from './dto/user.dto';
import { UsersController } from './users.controller';
import { UsersProviders } from './users.providers';
import { UsersService } from './users.service';

dotenv.config();

describe('UsersController', () => {
  let usersController: UsersController;
  let req: any;
  let userDto: any;

  beforeEach(async () => {
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

    usersController = usersModule.get<UsersController>(UsersController);

    // create a testing user
    const createUserDto = {
      email: 'fubuki@example.com',
      password: 'password',
      firstname: 'Fubuki',
      lastname: 'Shirakami',
      birthdate: new Date('2002-10-05'),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'customer',
      work: null,
    };

    const createdUser = await usersController.createUser(createUserDto);
    req = { user: createdUser };
    userDto = new UserDto(createdUser);
  });

  describe('getUser', () => {
    it('get user', async () => {
      const user = await usersController.getUser(req.user._id);
      expect(user).toStrictEqual(userDto);
    });

    it('get invalid user', async () => {
      try {
        await usersController.getUser('invalidId');
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('updateUser', () => {
    it('update user', async () => {
      const newFirstname = 'newfirstname';
      const newLastname = 'newlastname';
      const newBirthdate = new Date('2000-06-20');
      const newCitizenId = '1100987654321';
      const newBankAccountNumber = '0987654321';
      const profilePictureUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

      const profileDto = {
        password: null,
        firstname: newFirstname,
        lastname: newLastname,
        birthdate: newBirthdate,
        citizenId: newCitizenId,
        bankAccountNumber: newBankAccountNumber,
        profilePicture: profilePictureUrl,
      };

      userDto.firstname = newFirstname;
      userDto.lastname = newLastname;
      userDto.birthdate = newBirthdate;
      userDto.citizenId = newCitizenId;
      userDto.bankAccountNumber = newBankAccountNumber;
      userDto.profilePicture = profilePictureUrl;

      const user = await usersController.updateProfile(req, profileDto);
      expect(user).toStrictEqual(userDto);
    });

    it('get updated user', async () => {
      const user = await usersController.getUser(req.user._id);
      expect(user).toStrictEqual(userDto);
    });
  });

  afterEach(async () => {
    // delete the testing user
    await usersController.deleteUser(req, req.user._id);
    mongoose.connection.close();
  });
});
