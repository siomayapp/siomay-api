import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Filter, Pagination, Roles } from '../shared/decorators';
import { UserRole } from '../users/entities/users.role.enum';
import { HttpResponse } from '../shared/types';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationDto } from '../shared/dto';
import { FilterOrderDto } from './dto/filter-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.orderService.create(createOrderDto);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async findAll(
    @Filter() filter: FilterOrderDto,
    @Pagination() pagination: PaginationDto,
  ): Promise<HttpResponse> {
    const start = process.hrtime();
    const [data, count] = await this.orderService.findAll(pagination, filter);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, count, exec_time };
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION, UserRole.DISTRIBUTOR)
  async findOne(@Param('id') id: string): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.orderService.findOne(+id);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(+id, updateOrderDto);
  }

  @Patch('update-status/:id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION, UserRole.DISTRIBUTOR)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<HttpResponse> {
    const start = process.hrtime();
    await this.orderService.updateStatus(+id, updateOrderStatusDto);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, exec_time };
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async remove(@Param('id') id: string) {
    const start = process.hrtime();
    await this.orderService.remove(+id);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, exec_time };
  }
}
