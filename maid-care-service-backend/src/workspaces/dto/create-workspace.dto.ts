import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({ type: String })
  readonly customerId: string;

  @ApiProperty({ type: String })
  readonly description: string;

  @ApiProperty({ type: Number })
  readonly latitude: number;

  @ApiProperty({ type: Number })
  readonly longitude: number;
}
