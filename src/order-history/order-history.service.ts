import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { IPagination } from '../shared/types';
import { CreateOrderHistoryDto } from './dto/create-order-history.dto';
import { UpdateOrderHistoryDto } from './dto/update-order-history.dto';
import { OrderHistory } from './entities/order-history.entity';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepo: Repository<OrderHistory>,
  ) {}

  async getOrderHistory(orderId: number): Promise<any> {
    const result = await getManager().query(`
      SELECT 
        oh1.cycle,
        (select json_agg(r.status::json)
        from (select oh."orderStatus" as status
          from public.order_history as oh 
          where oh.cycle = oh1.cycle and oh."orderId" = oh1."orderId"
        ) r
        ) as statuses
      FROM public.order_history as oh1
      where oh1."orderId"=${orderId}
      group by oh1.cycle, oh1."orderId"
      order by oh1.cycle ASC
    `);
    return result;
  }

  async create(createOrderHistoryDto: CreateOrderHistoryDto): Promise<void> {
    await this.orderHistoryRepo.save(createOrderHistoryDto);
  }

  // findAll() {
  //   return `This action returns all orderHistory`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} orderHistory`;
  // }

  // update(id: number, updateOrderHistoryDto: UpdateOrderHistoryDto) {
  //   return `This action updates a #${id} orderHistory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} orderHistory`;
  // }
}
