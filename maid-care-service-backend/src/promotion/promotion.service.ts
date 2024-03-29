import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Promotion } from './interfaces/promotion.interface';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @Inject('PROMOTION_MODEL') private promotionModel: Model<Promotion>,
  ) {}

  async findPromotion(code: string): Promise<Promotion> {
    return this.promotionModel.findOne({ code: code }).exec();
  }

  async findAll(): Promise<Promotion[]> {
    return this.promotionModel.find().exec();
  }

  async createPromotion(
    creater: string,
    createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion> {
    const oldPromotion = await this.findPromotion(createPromotionDto.code);
    if (oldPromotion) throw new ConflictException('duplicate promotion code');
    const createdPromotion = new this.promotionModel(createPromotionDto);
    createdPromotion.creater = creater;
    return await createdPromotion.save();
  }

  async removePromotion(code: string): Promise<Promotion> {
    const promotion = await this.findPromotion(code);
    if (!promotion) throw new NotFoundException('promotion not valid');
    return await promotion.remove();
  }

  randomCode(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
