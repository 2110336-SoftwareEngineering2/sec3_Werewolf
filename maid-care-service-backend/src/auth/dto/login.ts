import { ApiProperty } from '@nestjs/swagger';

export class Login {
  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @ApiProperty({ type: String })
  readonly password: string;
}
