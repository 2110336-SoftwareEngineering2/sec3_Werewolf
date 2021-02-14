import { Test, TestingModule } from '@nestjs/testing';
import { MaidsController } from './maids.controller';

describe('MaidsController', () => {
  let controller: MaidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaidsController],
    }).compile();

    controller = module.get<MaidsController>(MaidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
