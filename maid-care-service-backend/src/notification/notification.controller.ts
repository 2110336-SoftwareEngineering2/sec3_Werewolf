import {
  Controller,
  Body,
  Request,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { SubscriptionDto } from './dto/subscription.dto';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('subscribe')
  @ApiCreatedResponse({
    description: 'Subscribe to receive notification',
    type: SubscriptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async postSubscribe(
    @Request() req,
    @Body() subscriptionDto: SubscriptionDto,
  ): Promise<SubscriptionDto> {
    await this.notificationService.postSubscribe(req.user._id, subscriptionDto);
    return subscriptionDto;
  }

  @Delete('unsubscribe')
  @ApiCreatedResponse({
    description: 'Unsubscribe web push',
    type: SubscriptionDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async unsubscribe(@Request() req): Promise<SubscriptionDto> {
    try {
      const subscription = await this.notificationService.unsubscribe(
        req.user._id,
      );
      return new SubscriptionDto(subscription);
    } catch (error) {
      throw error;
    }
  }
}
