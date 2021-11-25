import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderHistoryDto } from './dto/create-order-history.dto';
import { UpdateOrderHistoryDto } from './dto/update-order-history.dto';
import { OrderHistory } from './entities/order-history.entity';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepo: Repository<OrderHistory>,
  ) {}

  async create(createOrderHistoryDto: CreateOrderHistoryDto): Promise<void> {
    await this.orderHistoryRepo.save(createOrderHistoryDto);
  }

  findAll() {
    return `This action returns all orderHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderHistory`;
  }

  update(id: number, updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return `This action updates a #${id} orderHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderHistory`;
  }
}
