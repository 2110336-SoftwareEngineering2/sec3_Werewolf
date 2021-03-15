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
import { CerrentLocationDto } from './dto/location.dto';
import { MaidDto } from './dto/maid.dto';

@Controller('maids')
@ApiTags('maid')
export class MaidsController {
  constructor(private readonly maidsService: MaidsService) {}

  @Get(':uid')
  @ApiCreatedResponse({ type: MaidDto })
  @ApiCreatedResponse({
    description: "return maid's average rating and totalReviews",
  })
  async getMaid(@Param('uid') id: string) {
    const maid = await this.maidsService.findMaid(id);
    if (!maid) throw new NotFoundException('invalid maid');
    return new MaidDto(maid);
  }

  @Put('update-work')
  @ApiCreatedResponse({ type: MaidDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async updateWork(@Request() req, @Body() workDto: WorkDto) {
    try {
      const maid = await this.maidsService.updateWork(
        req.user._id,
        workDto.work,
      );
      return new MaidDto(maid);
    } catch (error) {
      throw error;
    }
  }

  @Put('update-location')
  @ApiCreatedResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async updateLocation(
    @Request() req,
    @Body() locationDto: CerrentLocationDto,
  ) {
    try {
      await this.maidsService.updateLocation(
        req.user._id,
        locationDto.latitude,
        locationDto.longitude,
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  @Put('availability/:availability')
  @ApiCreatedResponse({ type: MaidDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  async setAvailability(
    @Request() req,
    @Param('availability') availability: boolean,
  ) {
    try {
      const maid = await this.maidsService.setAvailability(
        req.user._id,
        availability,
      );
      return new MaidDto(maid);
    } catch (error) {
      throw error;
    }
  }
}
