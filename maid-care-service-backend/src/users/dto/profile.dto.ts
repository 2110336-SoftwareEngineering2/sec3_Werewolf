import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  readonly firstname: string;

  @ApiProperty({ type: String })
  readonly lastname: string;

  @ApiProperty({ type: Date })
  readonly birthdate: Date;

  @ApiProperty({ type: String })
  readonly citizenId: string;

  @ApiProperty({ type: String })
  readonly nationality: string;

  @ApiProperty({ type: String })
  readonly bankAccountNumber: string;
}
