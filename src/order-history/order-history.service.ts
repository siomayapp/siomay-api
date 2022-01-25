import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { IPagination } from '../shared/types';
import { CreateOrderHistoryDistDto } from './dto/create-order-history-dist.dto';
import { CreateOrderHistoryDto } from './dto/create-order-history.dto';
import { UpdateOrderHistoryDistDto } from './dto/update-order-history-dist.dto';
import { UpdateOrderHistoryDto } from './dto/update-order-history.dto';
import { OrderHistoryDistributor } from './entities/order-history-distributor';
import { OrderHistory } from './entities/order-history.entity';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepo: Repository<OrderHistory>,
    @InjectRepository(OrderHistoryDistributor)
    private readonly orderHistoryDistRepo: Repository<OrderHistoryDistributor>,
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

  async getDistributorOrderHistory(
    distributorId: number,
    pagination: IPagination,
  ): Promise<[OrderHistoryDistributor[], number]> {
    const data = await getManager().query(`
      SELECT ohd.id, ohd.statuses, ohd."currentStatus", ohd."deliveryDate",
        (select row_to_json(ord2) 
          from (select ord.id, ord."orderType", ord."deliveryFreq", ord.customer, ord.phone, ord.address, ord.variants, ord.statuses, ord."createdDate", ord."createdBy", ord."modifiedDate", ord."modifiedBy", ord."orderNumber", ord.cycle, ord."deliveryDate", ord."nextDeliveryDate", ord."currentStatus",
              (select row_to_json(us) 
              from (select id, name, role, username, phone, address 
                from public.users 
                where users.id = ord."distributorId") as us
              ) as distributor 
            from public.order
            where id = ord.id
          ) as ord2
        ) as order
      FROM public.order_history_distributor as ohd
      LEFT JOIN public.order as ord on ord.id = ohd."orderId"
      WHERE ord."distributorId" = ${distributorId}
      order by case ohd."currentStatus"
        when 'incoming' then 0
        when 'processing' then 1
        when 'sending' then 2
        else 3
      end, ohd."deliveryDate" ASC 
      limit ${pagination.per_page}
      offset ${(pagination.page - 1) * pagination.per_page}
    `);

    const count = await getManager().query(`
      select count(*) from public.order_history_distributor as ohd
      LEFT JOIN public.order as ord on ord.id = ohd."orderId"
      WHERE ord."distributorId" = ${distributorId}
    `);

    return [data as OrderHistoryDistributor[], parseInt(count[0].count)];
  }

  async create(createOrderHistoryDto: CreateOrderHistoryDto): Promise<void> {
    await this.orderHistoryRepo.save(createOrderHistoryDto);
  }

  async createOrderHistoryDist(
    createOrderHistoryDistDto: CreateOrderHistoryDistDto,
  ): Promise<void> {
    await this.orderHistoryDistRepo.save(createOrderHistoryDistDto);
  }

  async updateOrderHistoryDist(
    updateOrderHistoryDistDto: UpdateOrderHistoryDistDto,
  ): Promise<void> {
    await this.orderHistoryDistRepo.update(
      {
        order: updateOrderHistoryDistDto.order,
        deliveryDate: updateOrderHistoryDistDto.deliveryDate,
      },
      updateOrderHistoryDistDto,
    );
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
