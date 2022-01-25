import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatusDto } from '../../order/dto/create-order.dto';
import { Order, OrderStatusName } from '../../order/entities/order.entity';

export class CreateOrderHistoryDistDto {
  @ValidateNested()
  order: Order;

  @ValidateNested()
  @Type(() => OrderStatusDto)
  statuses: OrderStatusDto[];

  @IsString()
  currentStatus: OrderStatusName;

  @IsDateString()
  deliveryDate: Date;

  @IsNumber()
  cycle: number;
}
