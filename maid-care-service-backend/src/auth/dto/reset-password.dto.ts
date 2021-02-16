import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  readonly newPassword: string;

  @ApiProperty({ type: String })
  readonly currentPassword: string;
}