import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Customer } from './interfaces/customer.interface';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CUSTOMER_MODEL') private customerModel: Model<Customer>,
  ) {}

  async findCustomer(id: string): Promise<Customer> {
    return this.customerModel.findOne({ _id: id }).exec();
  }

  async createNewCustomer(id: string): Promise<Customer> {
    const customerRegistered = await this.findCustomer(id);
    if (!customerRegistered) {
      const newCustomer = { _id: id };
      const createdCustomer = new this.customerModel(newCustomer);
      return await createdCustomer.save();
    }
    return customerRegistered;
  }
}
