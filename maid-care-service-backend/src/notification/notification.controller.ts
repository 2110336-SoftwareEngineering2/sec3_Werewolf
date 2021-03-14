import {
  Controller,
  Body,
  Request,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { SubscriptionDto } from './dto/subscription.dto';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async postSubscribe(
    @Request() req,
    @Body() subscriptionDto: SubscriptionDto,
  ) {
    return await this.notificationService.postSubscribe(
      req.user._id,
      subscriptionDto,
    );
  }

  @Delete('unsubscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async unsubscribe(@Request() req) {
    try {
      return await this.notificationService.unsubscribe(req.user._id);
    } catch (error) {
      throw error;
    }
  }
}
