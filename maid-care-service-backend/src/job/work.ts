import { ApiProperty } from '@nestjs/swagger';

export enum WorkType {
  house_cleaning = 'House Cleaning',
  dish_washing = 'Dish Washing',
  laundry = 'Laundry',
  gardening = 'Gardening',
  decluttering = 'Decluttering ',
}

export class Work {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;
}
