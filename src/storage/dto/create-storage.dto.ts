import { Variant } from '../entities/storage.entity';

export class CreateStorageDto {
  boxName: string;
  variant: Variant;
  amount: number;
}
