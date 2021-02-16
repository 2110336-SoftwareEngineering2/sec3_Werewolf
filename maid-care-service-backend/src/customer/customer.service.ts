import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Customer } from './interfaces/customer.interface';

@Injectable()
export class CustomerService {
  constructor(@Inject('CUSTOMER_MODEL') private customerModel: Model<Customer>) {}

  async findCustomer(email: string): Promise<Customer> {
    return this.customerModel.findOne({email: email}).exec();
  }

  async createNewCustomer(email: string): Promise<Customer> {
    let customerRegistered = await this.findCustomer(email);
    if (!customerRegistered) {
      let newCustomer = { email: email };
      let createdCustomer = new this.customerModel(newCustomer);
      return await createdCustomer.save();
    }
    return customerRegistered;
  }
}