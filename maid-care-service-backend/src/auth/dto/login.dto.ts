import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @ApiProperty({ type: String })
  readonly password: string;
}
