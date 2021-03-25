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
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { MaidsService } from './maids.service';
import { UpdateMaidDto } from './dto/update-maid.dto';
import { CerrentLocationDto } from './dto/location.dto';
import { MaidDto } from './dto/maid.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('maids')
@ApiTags('maid')
export class MaidsController {
  constructor(private readonly maidsService: MaidsService) {}

  @Get(':uid')
  @ApiCreatedResponse({ description: 'Get maid infomation', type: MaidDto })
  @ApiResponse({ status: 404, description: 'invalid maid' })
  async getMaid(@Param('uid') id: string) {
    const maid = await this.maidsService.findMaid(id);
    if (!maid) throw new NotFoundException('invalid maid');
    return new MaidDto(maid);
  }

  @Put('update')
  @ApiCreatedResponse({
    description: 'Update note or works of the maid',
    type: MaidDto,
  })
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
  @ApiBearerAuth('acess-token')
  async updateWork(@Request() req, @Body() updateMaidDto: UpdateMaidDto) {
    try {
      await this.maidsService.updateWork(req.user._id, updateMaidDto.work);
      const maid = await this.maidsService.updateNote(
        req.user._id,
        updateMaidDto.note,
      );
      return new MaidDto(maid);
    } catch (error) {
      throw error;
    }
  }

  @Put('update-location')
  @ApiCreatedResponse({
    description: 'Update cerrent location of the maid',
    type: Boolean,
  })
  @ApiResponse({ status: 400, description: 'invalid latitude or Longitude' })
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
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
  @ApiCreatedResponse({
    description: 'Set availability to receive the job',
    type: MaidDto,
  })
  @ApiResponse({ status: 401, description: 'user is not maid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('maid')
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
