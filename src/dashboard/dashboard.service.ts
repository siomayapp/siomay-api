import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { StorageTransaction } from '../storage-transaction/entities/storage-transaction.entity';
import { Variant } from '../variant/entities/variant.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
    @InjectRepository(StorageTransaction)
    private readonly stRepo: Repository<StorageTransaction>,
  ) {}

  async getTotalOrder(): Promise<number> {
    const totalOrder = await this.orderRepo.count();
    return totalOrder;
  }

  async getTotalSold(): Promise<number> {
    const { sold } = await this.stRepo
      .createQueryBuilder(`st`)
      .leftJoinAndSelect(Order, `ord`, `ord.id = st.orderId`)
      .select(`sum(st.amount)`, `sold`)
      .where(`st.type = 'out' and ord.currentStatus = 'finish'`)
      .getRawOne();
    return parseInt(sold);
  }

  async getSoldVariant(): Promise<Variant[]> {
    const result = await this.stRepo
      .createQueryBuilder(`st`)
      .leftJoinAndSelect(Order, `ord`, `ord.id = st.orderId`)
      .leftJoinAndSelect(Variant, `va`, `va.name = st.variant`)
      .select(`va.name, sum(st.amount)::int as out`)
      .where(`st.type = 'out' and ord.currentStatus = 'finish'`)
      .groupBy(`va.name`)
      .getRawMany();

    return result as Variant[];
    // return await this.variantRepo.find({ select: ['id', 'name', 'out'] });
  }

  async getTotalStock(): Promise<number> {
    const { stock } = await this.variantRepo
      .createQueryBuilder(`va`)
      .select(`sum(va.stock)`, `stock`)
      .getRawOne();
    return parseInt(stock);
  }

  async getTodayOrderList(): Promise<Order[]> {
    const today = new Date().toLocaleString('sv').slice(0, 10);
    const data = await getManager().query(
      `select ord.id, ord."orderType", ord."deliveryFreq", ord.customer, ord.address, ord.variants, ord.statuses, ord."createdDate", ord."createdBy", ord."modifiedDate", ord."modifiedBy", ord."orderNumber", ord.cycle, ord."deliveryDate", ord."nextDeliveryDate", ord."currentStatus",
        (select row_to_json(us) 
            from (select id, name, role, username 
              from public.users 
              where users.id = ord."distributorId") as us
        ) as distributor
      from public.order ord
      where date("deliveryDate") = $1
      order by ord."deliveryDate" ASC`,
      [today],
    );
    return data as Order[];
  }
}
