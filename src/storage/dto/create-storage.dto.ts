import { IsNumber, IsString } from 'class-validator';
import { Variant } from '../../variant/entities/variant.entity';

export class CreateStorageDto {
  @IsString()
  boxName: string;

  @IsNumber()
  variant: Variant;

  @IsNumber()
  amount: number;
}
