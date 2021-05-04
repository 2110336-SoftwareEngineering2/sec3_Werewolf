import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CerrentLocationDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  readonly latitude: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  readonly longitude: number;
}
