export class CreatePromotionDto {
  readonly email: string;
  readonly password: string;
  readonly description: string;
  readonly availableDate: Date;
  readonly expiredDate: Date;
}