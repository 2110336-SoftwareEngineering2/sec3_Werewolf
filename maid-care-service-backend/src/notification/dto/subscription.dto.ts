import { ApiProperty } from '@nestjs/swagger';

class Keys {
  @ApiProperty({ type: String })
  auth: string;

  @ApiProperty({ type: String })
  p256dh: string;
}

export class SubscriptionDto {
  constructor(object: any) {
    this.endpoint = object.endpoint;
    this.expirationTime = object.expirationTime;
    this.keys = object.keys;
  }

  @ApiProperty({ type: String })
  readonly endpoint: string;

  @ApiProperty({ type: Number })
  readonly expirationTime: number;

  @ApiProperty({ type: () => Keys })
  readonly keys: Keys;
}
