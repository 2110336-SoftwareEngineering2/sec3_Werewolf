import { ApiProperty } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';

export class WorkspaceDto extends CreateWorkspaceDto {
  constructor(object: any) {
    super();
    this._id = object._id;
    this.customerId = object.customerId;
    this.description = object.description;
    this.latitude = object.latitude;
    this.longitude = object.longitude;
  }

  @ApiProperty({ type: String })
  _id: string;
}
