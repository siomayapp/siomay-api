import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Variant } from '../variant/entities/variant.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  async getTotalOrder(): Promise<number> {
    const totalOrder = await this.orderRepo.count();
    return totalOrder;
  }

  async getSoldVariant(): Promise<Variant[]> {
    return await this.variantRepo.find({ select: ['id', 'name', 'out'] });
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
