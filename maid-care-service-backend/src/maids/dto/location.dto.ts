import { ApiProperty } from '@nestjs/swagger';

export class CerrentLocationDto {
  @ApiProperty({ type: Number })
  readonly latitude: number;

  @ApiProperty({ type: Number })
  readonly longitude: number;
}
