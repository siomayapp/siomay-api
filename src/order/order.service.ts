import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { OrderHistoryService } from '../order-history/order-history.service';
import { VariantService } from '../variant/variant.service';
import { CreateOrderDto, OrderVariantDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderType } from './entities/order.entity';
import * as crypto from 'crypto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { StorageService } from '../storage/storage.service';
import { IPagination } from '../shared/types';
import { lastOfArray } from '../shared/utils';
import { IFilterOrder } from './types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private variantService: VariantService,
    private orderHistoryService: OrderHistoryService,
    private storageService: StorageService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    if (
      createOrderDto.orderType == OrderType.PERIODIC &&
      (createOrderDto.distributor == undefined ||
        createOrderDto.distributor == null)
    ) {
      throw new BadRequestException('Distributor tidak boleh kosong');
    }

    if (
      createOrderDto.orderType == OrderType.DIRECT &&
      (createOrderDto.customer == undefined || createOrderDto.customer == null)
    ) {
      throw new BadRequestException('Customer tidak boleh kosong');
    }

    const initStatus = lastOfArray(createOrderDto.statuses);
    const orderNumber = this.generateOrderNumber(
      createOrderDto.orderType,
      initStatus.statusDate,
    );

    let nextDeliveryDate: Date | undefined;
    if (createOrderDto.orderType == OrderType.PERIODIC) {
      nextDeliveryDate = new Date(createOrderDto.deliveryDate);
      nextDeliveryDate.setDate(
        nextDeliveryDate.getDate() + createOrderDto.deliveryFreq,
      );
    }

    const order = this.orderRepo.create({
      ...createOrderDto,
      statuses: createOrderDto.statuses,
      orderNumber: orderNumber,
      currentStatus: initStatus.status,
      nextDeliveryDate: nextDeliveryDate,
      cycle: createOrderDto.orderType == OrderType.PERIODIC ? 1 : 0,
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
      cycle: order.cycle,
    });

    await this.orderHistoryService.createOrderHistoryDist({
      order: order,
      statuses: order.statuses,
      currentStatus: 'incoming',
      deliveryDate: order.deliveryDate,
      cycle: order.cycle,
    });

    return await this.orderRepo.preload(order);
  }

  async findAll(
    pagination: IPagination,
    filter: IFilterOrder,
  ): Promise<[Order[], number]> {
    // const result = await this.orderRepo.findAndCount({
    //   skip: (pagination.page - 1) * pagination.per_page,
    //   take: pagination.per_page,
    //   order: { deliveryDate: 'ASC' },
    // });

    // const result = await this.orderRepo
    //   .createQueryBuilder('order')
    //   .leftJoinAndSelect('order.distributor', 'distributor')
    //   .skip((pagination.page - 1) * pagination.per_page)
    //   .take(pagination.per_page)
    //   .orderBy(
    //     `case order.currentStatus
    //       when 'incoming' then 0
    //       when 'processing' then 1
    //       when 'sending' then 2
    //       else 3
    //     end`,
    //   )
    //   .addOrderBy('order.deliveryDate', 'ASC')
    //   .getManyAndCount();

    const filterQuery = this.generateFilterQuery(filter);
    const data = await getManager().query(`
      select ord.id, ord."orderType", ord."deliveryFreq", ord.customer, ord.phone, ord.address, ord.variants, ord.statuses, ord."createdDate", ord."createdBy", ord."modifiedDate", ord."modifiedBy", ord."orderNumber", ord.cycle, ord."deliveryDate", ord."nextDeliveryDate", ord."currentStatus",
        (select row_to_json(us) 
            from (select id, name, role, username, phone, address 
              from public.users 
              where users.id = ord."distributorId") as us
        ) as distributor
      from public.order ord
      where ${filterQuery}
      order by case ord."currentStatus"
        when 'incoming' then 0
        when 'processing' then 1
        when 'sending' then 2
        else 3
      end, ord."deliveryDate" ASC
      limit ${pagination.per_page}
      offset ${(pagination.page - 1) * pagination.per_page}
    `);

    const count = await getManager().query(`
      select count(*) from public.order ord where ${filterQuery}
    `);

    return [data as Order[], parseInt(count[0].count)];
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
    const newStatus = lastOfArray(updateOrderStatusDto.statuses);
    if (newStatus.status == 'processing') {
      await this.processOrder(id, updateOrderStatusDto.variants);
    }

    const order = await this.orderRepo.preload({ id, ...updateOrderStatusDto });
    order.currentStatus = newStatus.status;
    for (let i = 0; i < order.variants.length; i++) {
      const dataVariant = order.variants[i];
      const loadedVariant = await this.variantService.findOne(
        dataVariant.variant as unknown as number,
        ['id', 'name'],
      );
      order.variants[i].variant = loadedVariant;
    }

    await this.orderRepo.save(order);
    await this.orderHistoryService.create({
      order: order,
      orderStatus: newStatus,
      cycle: order.cycle,
    }); //
    await this.orderHistoryService.updateOrderHistoryDist({
      order: order,
      deliveryDate: order.deliveryDate,
      statuses: order.statuses,
      currentStatus: order.currentStatus,
    });

    if (newStatus.status == 'finish' && order.orderType == OrderType.PERIODIC) {
      await this.resetOrder(order);
    }
  }

  async resetOrder(order: Order): Promise<void> {
    for (const variant of order.variants) {
      variant.isPicked = false;
      variant.pickedAmount = 0;
      variant.pickedFrom = null;
    }
    order.statuses = [
      {
        actor: 'system',
        note: null,
        status: 'incoming',
        statusDate: new Date(),
      },
    ];
    order.currentStatus = 'incoming';
    order.cycle += 1;
    order.deliveryDate = order.nextDeliveryDate;
    order.nextDeliveryDate = new Date(order.deliveryDate);
    order.nextDeliveryDate.setDate(
      order.nextDeliveryDate.getDate() + order.deliveryFreq,
    );
    await this.orderRepo.save(order);
    await this.orderHistoryService.create({
      order: order,
      orderStatus: lastOfArray(order.statuses),
      cycle: order.cycle,
    });
    await this.orderHistoryService.createOrderHistoryDist({
      order: order,
      statuses: order.statuses,
      currentStatus: 'incoming',
      deliveryDate: order.deliveryDate,
      cycle: order.cycle,
    });
  }

  async processOrder(
    orderId: number,
    orderVariants: OrderVariantDto[],
  ): Promise<void> {
    orderVariants.forEach(async (variant) => {
      for (const storage of variant.pickedFrom) {
        await this.storageService.updateAmount({
          updateAmountDto: {
            amount: storage.pickedAmount,
            updateAmountType: 'out',
          },
          boxName: storage.storage,
          isProcessingOrder: true,
          orderId: orderId,
        });
      }
    });
  }

  private generateOrderNumber(
    orderType: string,
    initialStatusDate: Date,
  ): string {
    const firstPart = orderType == 'periodic' ? 'PER' : 'DIR';
    const newDate = new Date(initialStatusDate);
    const secondPart = `${newDate.getFullYear()}${
      newDate.getMonth() + 1
    }${newDate.getDate()}`;
    const thirdPart = crypto.randomBytes(6).toString('base64');
    return [firstPart, secondPart, thirdPart].join('/');
    // return Buffer.from(str, 'binary').toString('base64');
  }

  private generateFilterQuery(filter: IFilterOrder): string {
    let query = '1=1';
    if (filter.status != undefined && filter.status != '') {
      const statusesArray = filter.status.split(',');
      let statusesString = '';
      for (const status of statusesArray) {
        statusesString += `'${status}',`;
      }
      query += ` and ord."currentStatus" in (${statusesString.slice(0, -1)})`;
    }

    if (filter.startDate != undefined && filter.startDate != '') {
      if (filter.endDate == undefined || filter.endDate == '') {
        const endDate = new Date(filter.startDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.endDate = endDate.toISOString().substring(0, 10);
      }
      query += ` and ord."deliveryDate" >= '${filter.startDate}' and ord."deliveryDate" < '${filter.endDate}'`;
    }

    if (filter.orderType != undefined && filter.orderType != '') {
      query += ` and ord."orderType" = '${filter.orderType}'`;
    }
    return query;
  }
}
