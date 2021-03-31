import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DatabaseModule } from '../database/database.module';
import { PromotionDto } from './dto/promotion.dto';
import { PromotionController } from './promotion.controller';
import { PromotionProviders } from './promotion.providers';
import { PromotionService } from './promotion.service';

describe('PromotionController', () => {
  let promotionController: PromotionController;
  let promotionService: PromotionService;

  const adminReq = { user: { _id: '602a4e322b8caf19b4c4e962', role: 'admin' } };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
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

    promotionController = module.get<PromotionController>(PromotionController);
    promotionService = module.get<PromotionService>(PromotionService);
  });

  describe('findAll', () => {
    it('return an array of promotions', async () => {
      const result = await promotionService.findAll();
      expect(await promotionController.findAll()).toStrictEqual(result);
    });
  });

  describe('newPromotion', () => {
    const testCode = 'GSIMPTQ125';
    const createPromotionDto = {
      code: testCode,
      description: 'test promotion code',
      discountRate: 15,
      availableDate: null,
      expiredDate: null,
    };
    const promotionDto = new PromotionDto(createPromotionDto);
    promotionDto.creater = adminReq.user._id;

    it('create new promotion', async () => {
      // create new promotion
      expect(
        await promotionController.createPromotion(adminReq, createPromotionDto),
      ).toStrictEqual(promotionDto);

      // find promotion
      expect(await promotionController.findPromotion(testCode)).toStrictEqual(
        promotionDto,
      );

      // create duplicate promotion
      try {
        await promotionController.createPromotion(adminReq, createPromotionDto);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });

    it('delete promotion', async () => {
      // delete promotion
      expect(await promotionController.removePromotion(testCode)).toStrictEqual(
        promotionDto,
      );

      // find deleted promotion
      try {
        await promotionController.findPromotion(testCode);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }

      // delete nonexistent promotion
      try {
        await promotionController.removePromotion(testCode);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('expiredPromotion', () => {
    const expiredCode = '153YUSAENH';
    const createPromotionDto = {
      code: expiredCode,
      description: 'expired promotion code',
      discountRate: 50,
      availableDate: null,
      expiredDate: new Date(new Date().getTime() - 1),
    };
    const promotionDto = new PromotionDto(createPromotionDto);
    promotionDto.creater = adminReq.user._id;

    it('create expired promotion', async () => {
      expect(
        await promotionController.createPromotion(adminReq, createPromotionDto),
      ).toStrictEqual(promotionDto);
    });

    it('get expired promotion', async () => {
      try {
        await promotionController.findPromotion(expiredCode);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });

    it('delete expired promotion', async () => {
      expect(
        await promotionController.removePromotion(expiredCode),
      ).toStrictEqual(promotionDto);
    });
  });

  describe('unavailablePromotion', () => {
    const unavailableCode = 'TT7BVJNPL249';
    const createPromotionDto = {
      code: unavailableCode,
      description: 'unavailable promotion code',
      discountRate: 25,
      availableDate: new Date(new Date().getTime() + 6000000),
      expiredDate: null,
    };
    const promotionDto = new PromotionDto(createPromotionDto);
    promotionDto.creater = adminReq.user._id;

    it('create unavailable promotion', async () => {
      expect(
        await promotionController.createPromotion(adminReq, createPromotionDto),
      ).toStrictEqual(promotionDto);
    });

    it('get unavailable promotion', async () => {
      try {
        await promotionController.findPromotion(unavailableCode);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.status).toBe(409);
      }
    });

    it('delete unavailable promotion', async () => {
      expect(
        await promotionController.removePromotion(unavailableCode),
      ).toStrictEqual(promotionDto);
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
