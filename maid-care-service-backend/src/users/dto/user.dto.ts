import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  constructor(object: any) {
    this._id = object._id;
    this.email = object.email;
    this.firstname = object.firstname;
    this.lastname = object.lastname;
    this.birthdate = object.birthdate;
    this.citizenId = object.citizenId;
    this.bankAccountNumber = object.bankAccountNumber;
    this.profilePicture = object.profilePicture;
    this.role = object.role;
  }

  @ApiProperty({ type: String })
  readonly _id: string;

  @ApiProperty({ type: String })
  readonly email: string;

  @ApiProperty({ type: String })
  readonly firstname: string;

  @ApiProperty({ type: String })
  readonly lastname: string;

  @ApiProperty({ type: Date })
  readonly birthdate: Date;

  @ApiProperty({ type: String })
  readonly citizenId: string;

  @ApiProperty({ type: String })
  readonly bankAccountNumber: string;

  @ApiProperty({ type: String })
  readonly profilePicture: string;

  @ApiProperty({ enum: ['customer', 'maid', 'admin'] })
  readonly role: string;
}
