import { IsNumberString } from 'class-validator';
import { IPagination } from '../types';

export class PaginationDto implements IPagination {
  @IsNumberString()
  last: number;

  @IsNumberString()
  limit: number;
}
