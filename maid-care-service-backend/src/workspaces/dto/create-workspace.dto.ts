import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly customerId: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  readonly latitude: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  readonly longitude: number;
}
