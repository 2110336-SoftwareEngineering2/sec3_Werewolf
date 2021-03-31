import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  readonly firstname: string;

  @ApiProperty({ type: String })
  readonly lastname: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  readonly birthdate: Date;

  @ApiProperty({ type: String })
  readonly citizenId: string;

  @ApiProperty({ type: String })
  readonly bankAccountNumber: string;
}
