import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  constructor(expires_in: number, access_token: string) {
    this.expires_in = expires_in;
    this.access_token = access_token;
  }

  @ApiProperty({ type: Number })
  readonly expires_in: number;

  @ApiProperty({ type: String })
  readonly access_token: string;
}
