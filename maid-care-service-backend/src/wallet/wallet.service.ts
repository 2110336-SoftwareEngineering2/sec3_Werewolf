import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Wallet } from './interfaces/wallet.interface';

@Injectable()
export class WalletService {
  constructor(@Inject('WALLET_MODEL') private walletModel: Model<Wallet>) {}

  async findWallet(id: string): Promise<Wallet> {
    if (String(id).length === 24) {
      return this.walletModel.findOne({ _id: id }).exec();
    } else return null;
  }

  async createNewWallet(id: string): Promise<Wallet> {
    const customerRegistered = await this.findWallet(id);
    if (!customerRegistered) {
      const newCustomer = { _id: id };
      const createdCustomer = new this.walletModel(newCustomer);
      return await createdCustomer.save();
    }
    return customerRegistered;
  }

  async addCoin(id: string, g_coin: number): Promise<Wallet> {
    const walletFromDb = await this.findWallet(id);
    if (!walletFromDb) throw new NotFoundException('invalid wallet');
    // update note
    walletFromDb.g_coin += g_coin;
    return await walletFromDb.save();
  }

  async removeCoin(id: string, g_coin: number): Promise<Wallet> {
    const walletFromDb = await this.findWallet(id);
    if (!walletFromDb) throw new NotFoundException('invalid wallet');
    // update note
    walletFromDb.g_coin -= g_coin;
    return await walletFromDb.save();
  }
}
