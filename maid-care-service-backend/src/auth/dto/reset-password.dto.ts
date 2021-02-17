import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @ApiProperty({ type: String })
  readonly newPassword: string;

  @ApiProperty({ type: String })
  readonly currentPassword: string;
}
