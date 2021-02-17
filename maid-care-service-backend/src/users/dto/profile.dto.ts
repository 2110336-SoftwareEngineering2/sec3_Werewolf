import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  constructor(object: any) {
    this.firstname = object.firstname;
    this.lastname = object.lastname;
    this.phone = object.phone;
  }

  @ApiProperty({ type: String })
  readonly firstname: string;

  @ApiProperty({ type: String })
  readonly lastname: string;

  @ApiProperty({ type: String })
  readonly phone: string;
}
