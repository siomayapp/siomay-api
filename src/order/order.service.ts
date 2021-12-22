import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderHistoryService } from '../order-history/order-history.service';
import { VariantService } from '../variant/variant.service';
import { CreateOrderDto, OrderVariantDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderType } from './entities/order.entity';
import * as crypto from 'crypto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { StorageService } from '../storage/storage.service';
import { IPagination } from '../shared/types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private variantService: VariantService,
    private orderHistoryService: OrderHistoryService,
    private storageService: StorageService,
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

    // if (order.orderType == OrderType.PERIODIC) {
    //   order.nextDeliveryDate = new Date().setDate(
    //     order.deliveryDate.getDate() + order.deliveryFreq,
    //   );
    // }

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

  async findAll(pagination: IPagination): Promise<[Order[], number]> {
    // const result = await this.orderRepo.findAndCount({
    //   skip: (pagination.page - 1) * pagination.per_page,
    //   take: pagination.per_page,
    //   order: { deliveryDate: 'ASC' },
    // });
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .skip((pagination.page - 1) * pagination.per_page)
      .take(pagination.per_page)
      .orderBy({ 'order.deliveryDate': 'ASC' })
      .getManyAndCount();
    return result;
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

  async updateStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<void> {
    const newStatus =
      updateOrderStatusDto.statuses[updateOrderStatusDto.statuses.length - 1];
    if (newStatus.status == 'processing') {
      await this.processOrder(id, updateOrderStatusDto.variants);
    }

    const order = await this.orderRepo.preload({ id, ...updateOrderStatusDto });
    for (let i = 0; i < order.variants.length; i++) {
      const dataVariant = order.variants[i];
      const loadedVariant = await this.variantService.findOne(
        dataVariant.variant as unknown as number,
        ['id', 'name'],
      );
      order.variants[i].variant = loadedVariant;
    }

    if (newStatus.status == 'finish' && order.orderType == OrderType.PERIODIC) {
      order.cycle += 1;
      order.lastCycle = newStatus.statusDate;
      // reset statusnya gimana?
    }

    await this.orderRepo.save(order);
    await this.orderHistoryService.create({
      order: order,
      orderStatus: newStatus,
    });
  }

  async processOrder(
    orderId: number,
    orderVariants: OrderVariantDto[],
  ): Promise<void> {
    orderVariants.forEach(async (variant) => {
      for (const storage of variant.pickedFrom) {
        await this.storageService.updateAmount(
          {
            amount: storage.pickedAmount,
            updateAmountType: 'out',
          },
          undefined,
          storage.storage,
          true,
          orderId,
        );
      }
    });
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
