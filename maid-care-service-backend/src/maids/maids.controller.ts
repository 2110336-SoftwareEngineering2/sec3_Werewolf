import { Controller, Param, Get, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { MaidsService } from './maids.service';

@Controller('maids')
@ApiTags('maid')
export class MaidsController {
  constructor(private readonly maidsService: MaidsService) {}

  @Get(':id/rating')
  @ApiCreatedResponse({
    description: "return maid's average rating and totalReviews",
  })
  async getMaid(@Param('id') id: string) {
    const maid = await this.maidsService.findMaid(id);
    if (!maid) throw new NotFoundException('invalid maid');
    const result = {
      avgRating: maid.avgRating,
      totalReviews: maid.totalReviews,
    };
    return result;
  }
}
