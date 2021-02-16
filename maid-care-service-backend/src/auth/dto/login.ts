import { ApiProperty } from '@nestjs/swagger'

export class Login {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  readonly password: string;
}