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
  OrderVariantStorage,
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

export class OrderVariantStorageDto implements OrderVariantStorage {
  @IsString()
  storage: string;

  @IsNumber()
  pickedAmount: number;
}

export class OrderVariantDto implements OrderVariant {
  @IsNumber()
  variant: Variant;

  @IsNumber()
  amount: number;

  @IsBoolean()
  isPicked: boolean;

  @IsNumber()
  pickedAmount: number;

  @ValidateNested()
  @Type(() => OrderVariantStorageDto)
  @ValidateIf((object, value) => value !== null)
  pickedFrom: OrderVariantStorage[] | null;
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
  statuses: OrderStatusDto[];
}
