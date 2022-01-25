import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderHistoryDistDto } from './create-order-history-dist.dto';

export class UpdateOrderHistoryDistDto extends PartialType(
  CreateOrderHistoryDistDto,
) {}
