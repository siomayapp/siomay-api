import { IsDateString, IsString } from 'class-validator';
import { IFilterOrder } from '../types';

export class FilterOrderDto implements IFilterOrder {
  @IsString()
  status?: string;

  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @IsString()
  orderType?: string;
}
