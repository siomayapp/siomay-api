import { IsNumberString } from 'class-validator';
import { IFilterStorage } from '../types';

export class FilterStorageDto implements IFilterStorage {
  @IsNumberString()
  variant: number;
}
