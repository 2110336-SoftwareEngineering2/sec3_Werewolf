import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ProfileDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly firstname: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  readonly birthdate: Date;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  readonly citizenId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  readonly bankAccountNumber: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsUrl()
  readonly profilePicture: string;
}
