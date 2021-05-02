import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;
}
