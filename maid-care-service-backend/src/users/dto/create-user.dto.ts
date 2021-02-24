import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, format: 'email' })
  email: string;

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

  @ApiProperty({ type: String })
  readonly phone: string;

  @ApiProperty({ enum: ['customer', 'maid', 'admin'] })
  readonly role: string;
}
