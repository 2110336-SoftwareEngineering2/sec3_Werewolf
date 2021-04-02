import { Injectable } from '@nestjs/common';
import { Job } from '../job/interfaces/job.interface';
import { JobService } from '../job/job.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MaidsService } from '../maids/maids.service';
import { Maid } from '../maids/interfaces/maids.interface';
import { UsersService } from '../users/users.service';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Injectable()
export class ReviewService {
  constructor(
    private maidService: MaidsService,
    private readonly jobService: JobService,
  ) {}

  async updateJobReview(updateJobReview: UpdateReviewDto): Promise<Job> {
    const job = await this.jobService.updateJobReview(updateJobReview);
    return job;
  }

  async updateMaidRating(maidId: string, newRating: number): Promise<Maid> {
    const maid = await this.maidService.updateMaidRating(maidId, newRating);
    return maid;
  }
}

@Injectable()
export class ReviewTest {
  constructor(
    private jobService: JobService,
    private maidService: MaidsService,
    private userService: UsersService,
    private workspacesService: WorkspacesService,
  ) {}

  async testReview(): Promise<Job> {
    const createUserDto = {
      email: 'towasama@example.com',
      password: 'password',
      firstname: 'Pekora',
      lastname: 'Usada',
      birthdate: new Date(),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'customer',
      work: null,
    };
    const createUser2Dto = {
      email: 'korone@example.com',
      password: 'password',
      firstname: 'Kiara',
      lastname: 'Takanashi',
      birthdate: new Date(),
      citizenId: '1100123456789',
      bankAccountNumber: '1234567890',
      role: 'maid',
      work: ['House Cleaning', 'Dish Washing', 'Laundry', 'Gardening'],
    };
    const createdCustomer = await this.userService.register(createUserDto);
    const createdMaid = await this.userService.register(createUser2Dto);
    createdCustomer.valid = true;
    createdMaid.valid = true;
    createdCustomer.save();
    createdMaid.save();

    const maid = await this.maidService.createNewMaid(createdMaid._id);
    const createWorkspaceDto = {
      customerId: createdCustomer._id.toString(),
      description: 'towaland',
      latitude: 62.14598,
      longitude: 14.29536,
    };
    const workspace = await this.workspacesService.addNewWorkspace(
      createWorkspaceDto,
    );
    const workspaceId = workspace._id.toString();
    const createJobDto = {
      workplaceId: workspaceId,
      work: [
        {
          typeOfWork: 'House Cleaning',
          description: 'Cleaning my house',
          quantity: 5,
        },
      ],
      promotionCode: null,
    };
    const Job = await this.jobService.createJob(
      createdCustomer._id,
      createJobDto,
    );
    Job.maidId = maid._id;
    Job.save();
    this.jobService.jobDone(Job);
    const updateReviewDto = {
      rating: 4,
      reviewDescription: 'good',
      jobId: Job._id,
      maidId: maid._id,
    };
    maid.avgRating = 0;
    maid.totalReviews = 0;
    maid.save();
    await this.jobService.updateMaidRating(maid._id, 4);
    const jobReview = await this.jobService.updateJobReview(updateReviewDto);

    return jobReview;
  }
}
