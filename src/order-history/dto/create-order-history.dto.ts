import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { OrderStatusDto } from '../../order/dto/create-order.dto';
import { Order } from '../../order/entities/order.entity';

export class CreateOrderHistoryDto {
  @ValidateNested()
  order: Order;

  @ValidateNested()
  @Type(() => OrderStatusDto)
  orderStatus: OrderStatusDto;
}
