import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from '../../job/dto/job.dto';
import { UserDto } from '../../users/dto/user.dto';

export class RefundDto {
  constructor(object: any) {
    this._id = object._id;
    this.description = object.description;
    this.createDate = object.createDate;
  }

  @ApiProperty({ type: String })
  readonly _id: string;

  @ApiProperty({ type: String })
  readonly description: string;

  @ApiProperty({ type: Date })
  readonly createDate: Date;

  @ApiProperty({ type: UserDto })
  customer: UserDto;

  @ApiProperty({ type: JobDto })
  job: JobDto;
}
