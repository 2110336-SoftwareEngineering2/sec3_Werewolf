import {
  Controller,
  Request,
  Get,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { MaidsService } from './maids.service';

@Controller('maids')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('acess-token')
@ApiTags('maid')
export class MaidsController {
  constructor(private readonly maidsService: MaidsService) {}

  @Get()
  async getCustomer(@Request() req) {
    if (req.user.role === 'maid') {
      try {
        const maid = await this.maidsService.findMaid(req.user.email);
        if (!maid) throw new ForbiddenException('Invalid maid');
        const result = {
          email: maid.email,
          avgRating: maid.avgRating,
          totalReviews: maid.totalReviews,
        };
        return result;
      } catch (error) {
        throw error;
      }
    } else throw new UnauthorizedException('user is not maid');
  }
}
