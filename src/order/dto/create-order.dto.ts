import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Variant } from '../../variant/entities/variant.entity';
import {
  OrderStatus,
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

  @IsBoolean()
  isPicked: boolean;
}

export class OrderStatusDto implements OrderStatus {
  @IsString()
  status: 'incoming' | 'processing' | 'sending' | 'finish';

  @IsDateString()
  statusDate: Date;

  @IsString()
  actor: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  note: string | null;
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

  @ValidateNested()
  @Type(() => OrderStatusDto)
  status: OrderStatusDto;
}
