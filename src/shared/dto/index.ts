import { IsNumberString } from 'class-validator';
import { IPagination } from '../types';

export class PaginationDto implements IPagination {
  @IsNumberString()
  page: number;

  @IsNumberString()
  per_page: number;
}
