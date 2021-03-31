import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { JobModule } from '../job/job.module';
import { MaidsModule } from '../maids/maids.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersController } from '../users/users.controller';
import { UsersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';
import { WalletModule } from '../wallet/wallet.module';
import { DatabaseModule } from '../database/database.module';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesModule } from './workspaces.module';
import { WorkspaceProviders } from './workspaces.providers';
import { WorkspacesService } from './workspaces.service';
import { WorkspaceDto } from './dto/workspace.dto';

describe('WorkspacesController', () => {
  let workspacesController: WorkspacesController;
  let workspacesService: WorkspacesService;
  let usersController: UsersController;
  let customerReq: any;

  beforeAll(async () => {
    const workspacesModule: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [WorkspacesController],
      providers: [WorkspacesService, ...WorkspaceProviders],
    })
      .overrideProvider('DATABASE_CONNECTION')
      .useFactory({
        factory: async (): Promise<typeof mongoose> =>
          await mongoose.connect(
            'mongodb://localhost/maid_care_service_database',
            {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useFindAndModify: false,
            },
          ),
      })
      .compile();

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
    })
      .overrideProvider('DATABASE_CONNECTION')
      .useFactory({
        factory: async (): Promise<typeof mongoose> =>
          await mongoose.connect(
            'mongodb://localhost/maid_care_service_database',
            {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useFindAndModify: false,
            },
          ),
      })
      .compile();

    workspacesController = workspacesModule.get<WorkspacesController>(
      WorkspacesController,
    );
    workspacesService = workspacesModule.get<WorkspacesService>(
      WorkspacesService,
    );
    usersController = usersModule.get<UsersController>(UsersController);

    // create a testing user
    const createUserDto = {
      email: 'amelia@example.com',
      password: 'password',
      firstname: 'Amelia',
      lastname: 'Watson',
      birthdate: new Date(),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'customer',
      work: null,
    };
    const createdCustomer = await usersController.createUser(createUserDto);
    customerReq = { user: createdCustomer };
  });

  describe('findAll', () => {
    it('return an array of workspaces', async () => {
      const result = await workspacesService.findAllWorkspaceByCustomerId(
        customerReq.user._id,
      );
      expect(
        await workspacesController.findAllWorkspace(customerReq),
      ).toStrictEqual(result);
    });
  });

  describe('newWorkspace', () => {
    let workspaceDto: WorkspaceDto;

    it('create new workspace', async () => {
      const createWorkspaceDto = {
        customerId: customerReq.user._id.toString(),
        description: 'pekoland',
        latitude: 62.14598,
        longitude: 14.29536,
      };
      workspaceDto = new WorkspaceDto(createWorkspaceDto);

      // create new workspace
      const newWorkspace = await workspacesController.createWorkspace(
        createWorkspaceDto,
      );
      workspaceDto._id = newWorkspace._id;
      expect(newWorkspace).toStrictEqual(workspaceDto);

      // find workspace
      expect(
        await workspacesController.findWorkspacebyWorkspaceId(workspaceDto._id),
      ).toStrictEqual(workspaceDto);

      // create duplicate workspace
      try {
        await workspacesController.createWorkspace(createWorkspaceDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });

    it('delete workspace', async () => {
      // other customer try to delete your workspace
      const otherReq = {
        user: { _id: '602a73161507755ee8e094e1', role: 'customer' },
      };
      try {
        await workspacesController.removeWorkspaceByWorkspaceId(
          otherReq,
          workspaceDto._id,
        );
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // delete workspace
      expect(
        await workspacesController.removeWorkspaceByWorkspaceId(
          customerReq,
          workspaceDto._id,
        ),
      ).toStrictEqual(workspaceDto);

      // find deleted workspace
      try {
        await workspacesController.findWorkspacebyWorkspaceId(workspaceDto._id);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // delete nonexistent workspace
      try {
        await workspacesController.removeWorkspaceByWorkspaceId(
          customerReq,
          workspaceDto._id,
        );
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
