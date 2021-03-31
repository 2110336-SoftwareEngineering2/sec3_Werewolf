import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly newPassword: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly currentPassword: string;
}
