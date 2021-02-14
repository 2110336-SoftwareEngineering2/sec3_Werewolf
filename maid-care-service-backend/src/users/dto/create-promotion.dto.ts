export class CreatePromotionDto {
  readonly email: string;
  readonly description: string;
  readonly availableDate: Date;
  readonly expiredDate: Date;
}