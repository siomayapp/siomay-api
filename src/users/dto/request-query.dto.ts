import { IsString } from 'class-validator';
import { IFilterUser } from '../types';

export class FilterUserDto implements IFilterUser {
  @IsString()
  role: string;
}
