import { Controller } from '@nestjs/common';
import { MaidsService } from './maids.service';

@Controller('maids')
export class MaidsController {
  constructor(private readonly maidsService: MaidsService) {}
}
