import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Promotion } from './interfaces/promotion.interface';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(@Inject('PROMOTION_MODEL') private promotionModel: Model<Promotion>) {}

  async findPromotion(code: string): Promise<Promotion> {
    return this.promotionModel.findOne({code: code}).exec();
  }

  async createPromotion(creater: string, createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    let createdPromotion = new this.promotionModel(createPromotionDto);
    createdPromotion.creater = creater;
    let code;
    while (true) {
      code = this.randomCode(12);
      if (!await this.findPromotion(code)) break;
    }
    createdPromotion.code = code;
    return await createdPromotion.save();
  }

  async removePromotion(code: string) {
    let promotion = await this.findPromotion(code);
    if (!promotion) throw new NotFoundException('Promotion not valid');
    return await promotion.remove();
  }

  randomCode(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
