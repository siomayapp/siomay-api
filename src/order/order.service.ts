import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { OrderHistoryService } from '../order-history/order-history.service';
import { VariantService } from '../variant/variant.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private variantService: VariantService,
    private orderHistoryService: OrderHistoryService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const initStatus =
      createOrderDto.statuses[createOrderDto.statuses.length - 1];
    const orderNumber = this.generateOrderNumber(
      createOrderDto.orderType,
      initStatus.statusDate,
    );
    const order = await this.orderRepo.create({
      ...createOrderDto,
      statuses: createOrderDto.statuses,
      orderNumber: orderNumber,
    });
    for (let i = 0; i < order.variants.length; i++) {
      const dataVariant = order.variants[i];
      const loadedVariant = await this.variantService.findOne(
        dataVariant.variant as unknown as number,
        ['id', 'name'],
      );
      order.variants[i].variant = loadedVariant;
    }
    await this.orderHistoryService.create({
      order: order,
      orderStatus: initStatus,
    });

    return order;
  }

  async findAll(
    lastId: number,
    limit: number,
  ): Promise<[Order[], number | null]> {
    const orders = await this.orderRepo.find({
      where: { id: MoreThan(lastId) },
      take: limit,
    });
    const lastRow = orders.length > 0 ? orders[orders.length - 1].id : null;
    return [orders, lastRow];
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepo.findOneOrFail(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // const order = await this.findOne(id);
    const order = updateOrderDto;

    if (order.variants) {
      for (let i = 0; i < order.variants.length; i++) {
        const dataVariant = order.variants[i];
        const loadedVariant = await this.variantService.findOne(
          dataVariant.variant as unknown as number,
          ['id', 'name'],
        );
        order.variants[i].variant = loadedVariant;
      }
    }

    return await this.orderRepo.save({ id: id, ...order });
  }

  async remove(id: number): Promise<void> {
    // await this.orderRepo.softDelete(id);
    await this.orderRepo.delete(id);
  }

  async processOrder(id: number, processOrderDto): Promise<Order> {
    return await this.orderRepo.save(processOrderDto);
  }

  generateOrderNumber(orderType: string, initialStatusDate: Date): string {
    const firstPart = orderType == 'periodic' ? 'PER' : 'DIR';
    const newDate = new Date(initialStatusDate);
    const secondPart = `${newDate.getFullYear()}${
      newDate.getMonth() + 1
    }${newDate.getDate()}`;
    const thirdPart = crypto.randomBytes(6).toString('base64');
    return [firstPart, secondPart, thirdPart].join('/');
    // return Buffer.from(str, 'binary').toString('base64');
  }
}
