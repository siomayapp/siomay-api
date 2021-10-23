import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Variant } from '../../variant/entities/variant.entity';
import {
  OrderType,
  OrderVariant,
  // OrderVariantDetail,
} from '../entities/order.entity';

// class OrderVariantDetailDto implements OrderVariantDetail {
//   @IsNumber()
//   id: number;

//   @IsString()
//   name: string;
// }

// class OrderVariantDto implements OrderVariant {
//   @ValidateNested()
//   variant: OrderVariantDetailDto;

//   @IsNumber()
//   amount: number;
// }

class OrderVariantDto implements OrderVariant {
  @IsNumber()
  variant: Variant;

  @IsNumber()
  amount: number;
}

export class CreateOrderDto {
  @IsString()
  orderType: OrderType;

  @IsDateString()
  deliveryDate: Date;

  @IsNumber()
  deliveryFreq: number;

  @IsString()
  customer: string;

  @IsString()
  address: string;

  @ValidateNested()
  @Type(() => OrderVariantDto)
  variants: OrderVariantDto[];
}
