import { ApiProperty } from '@nestjs/swagger';
import { WorkType } from '../../maids/workType';

export class CostDto {
  constructor(object: any) {
    this.work = object.work;
    this.cost = object.cost;
  }

  @ApiProperty({ type: () => [WorkCost] })
  work: WorkCost[];

  @ApiProperty({ type: Number })
  cost: number;
}

class WorkCost {
  @ApiProperty({ enum: Object.values(WorkType) })
  typeOfWork: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  quantity: number;

  @ApiProperty({ enum: ['ตารางเมตร', 'จาน', 'ตัว'] })
  unit: string;

  @ApiProperty({ type: Number })
  cost: number;
}
