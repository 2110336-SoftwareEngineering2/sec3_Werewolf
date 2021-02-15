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
    var createdPromotion = new this.promotionModel(createPromotionDto);
    createdPromotion.creater = creater;
    while (true) {
      var code = this.randomCode(12);
      if (!await this.findPromotion(code)) break;
    }
    createdPromotion.code = code;
    return await createdPromotion.save();
  }

  async removePromotion(code: string) {
    var promotion = await this.findPromotion(code);
    if (!promotion) throw new NotFoundException('Promotion not valid');
    return await promotion.remove();
  }

  randomCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
