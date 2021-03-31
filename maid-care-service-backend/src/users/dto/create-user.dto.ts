import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsDateString } from 'class-validator';
import { WorkType } from '../../maids/workType';

export class CreateUserDto {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly firstname: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly lastname: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  readonly birthdate: Date;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly citizenId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly bankAccountNumber: string;

  @ApiProperty({ enum: ['customer', 'maid', 'admin'] })
  @IsNotEmpty()
  readonly role: string;

  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.values(WorkType),
    },
  })
  readonly work: string[];
}
