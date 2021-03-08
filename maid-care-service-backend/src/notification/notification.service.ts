import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as webpush from 'web-push';
import { Subscription } from './interfaces/subscription.interface';

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

  async findSubscription(id: string): Promise<Subscription> {
    if (String(id).length === 24) {
      return this.subscriptionModel.findOne({ _id: id }).exec();
    } else return null;
  }

  getPreload(): string {
    return this.publicVapidKey;
  }

  async postSubscribe(
    id: string,
    subscription: webpush.PushSubscription,
  ): Promise<any> {
    return await this.subscriptionModel.findOneAndUpdate(
      { _id: id },
      {
        _id: id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      { upsert: true },
    );
  }

  async unsubscribe(id: string): Promise<any> {
    const subscription = await this.findSubscription(id);
    if (subscription) {
      return await subscription.remove();
    }
  }

  async sendNotification(userId: string, message: string) {
    const notification = { title: message };
    const subscription = await this.findSubscription(userId);
    if (subscription)
      webpush.sendNotification(subscription, JSON.stringify(notification));
  }
}
