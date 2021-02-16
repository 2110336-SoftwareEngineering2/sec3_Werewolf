import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  readonly firstname: string;

  @ApiProperty({ type: String })
  readonly lastname: string;

  @ApiProperty({ type: String })
  readonly phone: string;

  @ApiProperty({ type: String })
  readonly role: string;
}