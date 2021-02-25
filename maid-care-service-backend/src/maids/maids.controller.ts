import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Put,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { MaidsService } from './maids.service';
import { WorkDto } from './dto/work.dto';

@Controller('maids')
@ApiTags('maid')
export class MaidsController {
  constructor(private readonly maidsService: MaidsService) {}

  @Get(':id')
  @ApiCreatedResponse({
    description: "return maid's average rating and totalReviews",
  })
  async getMaid(@Param('id') id: string) {
    const maid = await this.maidsService.findMaid(id);
    if (!maid) throw new NotFoundException('invalid maid');
    return maid;
  }

  @Put('update-work')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async updateWork(@Request() req, @Body() workDto: WorkDto) {
    try {
      const maid = await this.maidsService.updateWork(
        req.user._id,
        workDto.work,
      );
      return maid;
    } catch (error) {
      throw error;
    }
  }
}
