import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  longitude: number;
}
