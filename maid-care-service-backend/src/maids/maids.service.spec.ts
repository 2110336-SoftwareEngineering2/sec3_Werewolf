import { Test, TestingModule } from '@nestjs/testing';
import { MaidsService } from './maids.service';

describe('MaidsService', () => {
  let service: MaidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaidsService],
    }).compile();

    service = module.get<MaidsService>(MaidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
