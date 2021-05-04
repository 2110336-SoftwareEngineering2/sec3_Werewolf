import {
  Controller,
  Body,
  Param,
  Request,
  Get,
  Put,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MaidsService } from './maids.service';
import { UpdateMaidDto } from './dto/update-maid.dto';
import { CerrentLocationDto } from './dto/location.dto';
import { MaidDto } from './dto/maid.dto';

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
  async updateMaid(@Request() req, @Body() updateMaidDto: UpdateMaidDto) {
    // validate work
    if (updateMaidDto.work) {
      updateMaidDto.work.forEach((work) => {
        if (!this.maidsService.isValidTypeOfWork(work))
          throw new BadRequestException(work + ' is not valid type of work');
      });
    }
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
