import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DatabaseModule } from '../database/database.module';
import { PromotionDto } from './dto/promotion.dto';
import { PromotionController } from './promotion.controller';
import { PromotionModule } from './promotion.module';
import { PromotionProviders } from './promotion.providers';
import { PromotionService } from './promotion.service';

describe('PromotionController', () => {
  let promotionController: PromotionController;
  let promotionService: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PromotionModule, DatabaseModule],
      controllers: [PromotionController],
      providers: [PromotionService, ...PromotionProviders],
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

    promotionService = module.get<PromotionService>(PromotionService);
    promotionController = module.get<PromotionController>(PromotionController);
  });

  const admin = { user: { _id: '602a4e322b8caf19b4c4e962' } };

  const testCode = 'GSIMPTQ125';

  const createPromotionDto = {
    code: testCode,
    description: 'test promotion code',
    discountRate: 0.15,
    availableDate: null,
    expiredDate: null,
  };

  const newPromotion = new PromotionDto(createPromotionDto);
  newPromotion.creater = '602a4e322b8caf19b4c4e962';

  const expiredCode = '153YUSAENH';

  const createExpiredPromotionDto = {
    code: expiredCode,
    description: 'test expired promotion code',
    discountRate: 0.5,
    availableDate: null,
    expiredDate: new Date(new Date().getTime() - 1),
  };

  const expiredPromotion = new PromotionDto(createExpiredPromotionDto);
  expiredPromotion.creater = '602a4e322b8caf19b4c4e962';

  describe('createPromotion', () => {
    it('create new promotion', async () => {
      // create new promotion
      expect(
        await promotionController.createPromotion(admin, createPromotionDto),
      ).toStrictEqual(newPromotion);

      // find promotion
      expect(await promotionController.findPromotion(testCode)).toStrictEqual(
        newPromotion,
      );

      // create duplicate promotion
      try {
        await promotionController.createPromotion(admin, createPromotionDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });
  });

  describe('findAll', () => {
    it('return an array of promotions', async () => {
      const result = await promotionService.findAll();
      expect(await promotionController.findAll()).toStrictEqual(result);
    });
  });

  describe('expiredPromotion', () => {
    it('create expired promotion', async () => {
      // create expired promotion
      expect(
        await promotionController.createPromotion(
          admin,
          createExpiredPromotionDto,
        ),
      ).toStrictEqual(expiredPromotion);

      // find promotion
      try {
        await promotionController.findPromotion(expiredCode);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });
  });

  describe('removePromotion', () => {
    it('delete promotion', async () => {
      expect(await promotionController.removePromotion(testCode)).toStrictEqual(
        newPromotion,
      );

      expect(
        await promotionController.removePromotion(expiredCode),
      ).toStrictEqual(expiredPromotion);
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
