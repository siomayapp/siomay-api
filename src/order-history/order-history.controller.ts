import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { CreateOrderHistoryDto } from './dto/create-order-history.dto';
import { UpdateOrderHistoryDto } from './dto/update-order-history.dto';
import { UserRole } from '../users/entities/users.role.enum';
import { HttpResponse } from '../shared/types';
import { Roles } from '../shared/decorators';

@Controller('')
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @Get('order/:orderId/history')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async getOrderHistory(
    @Param('orderId') orderId: string,
  ): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.orderHistoryService.getOrderHistory(+orderId);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Get('distributor/:distributorId/order/history')
  @Roles(UserRole.DISTRIBUTOR)
  async getDistributorOrderHistory(
    @Param('distributorId') distributorId: string,
  ): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.orderHistoryService.getDistributorOrderHistory(
      +distributorId,
    );
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  // @Post()
  // create(@Body() createOrderHistoryDto: CreateOrderHistoryDto) {
  //   return this.orderHistoryService.create(createOrderHistoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.orderHistoryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderHistoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderHistoryDto: UpdateOrderHistoryDto) {
  //   return this.orderHistoryService.update(+id, updateOrderHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderHistoryService.remove(+id);
  // }
}
