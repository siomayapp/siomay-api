import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      .select(`va.name, sum(st.amount) as out`)
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
    return await this.orderRepo
      .createQueryBuilder('order')
      .where('date("deliveryDate") = :today', { today: today })
      .orderBy({ 'order.deliveryDate': 'ASC' })
      .getMany();
  }
}
