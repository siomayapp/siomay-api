import { IsNumber, IsString } from 'class-validator';

export class UpdateStorageAmountDto {
  @IsString()
  updateAmountType: 'in' | 'out';

  @IsNumber()
  amount: number;
}
