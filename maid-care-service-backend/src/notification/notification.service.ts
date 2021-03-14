import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as webpush from 'web-push';
import { Subscription } from './interfaces/subscription.interface';
import { SubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class NotificationService {
  private publicVapidKey =
    'BJGVXlKjnWVNxjWzmPppvA-8PA77r0j5XzvaY9OduhMaMHQaI-YXiEjgcOqLnhC1GpQE4f0ZZ53PzR9GeodbVD0';
  private privateVapidKey = 'OJfWE004Gif3aPbhvfnS5cTpN6wvWjGlgtyHaMXnT1w';

  constructor(
    @Inject('SUBSCRIPTION_MODEL')
    private subscriptionModel: Model<Subscription>,
  ) {
    this.setupWebPush();
  }

  setupWebPush(): void {
    webpush.setVapidDetails(
      'localhost:3000',
      this.publicVapidKey,
      this.privateVapidKey,
    );
  }

  async findSubscription(userId: string): Promise<Subscription> {
    if (String(userId).length === 24) {
      return this.subscriptionModel.findOne({ _id: userId }).exec();
    } else return null;
  }

  getPreload(): string {
    return this.publicVapidKey;
  }

  async postSubscribe(
    userId: string,
    subscription: SubscriptionDto,
  ): Promise<Subscription> {
    await this.subscriptionModel.findOneAndUpdate(
      { _id: userId },
      {
        _id: userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      { upsert: true },
    );
    return this.findSubscription(userId);
  }

  async unsubscribe(userId: string): Promise<Subscription> {
    const subscription = await this.findSubscription(userId);
    if (!subscription) throw new NotFoundException('no subscription');
    return await subscription.remove();
  }

  async sendNotification(userId: string, message: string) {
    const notification = { title: message };
    const subscription = await this.findSubscription(userId);
    if (subscription)
      webpush.sendNotification(subscription, JSON.stringify(notification));
  }
}
