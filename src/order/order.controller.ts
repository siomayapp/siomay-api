import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Pagination, Roles } from '../shared/decorators';
import { UserRole } from '../users/entities/users.role.enum';
import { Response } from 'express';
import { HttpResponse } from '../shared/types';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationDto } from '../shared/dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const data = await this.orderService.create(createOrderDto);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async findAll(
    @Pagination() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const [data, count] = await this.orderService.findAll(pagination);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, count, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const data = await this.orderService.findOne(+id);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
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
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      await this.orderService.updateStatus(+id, updateOrderStatusDto);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const start = process.hrtime();
      await this.orderService.remove(+id);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }
}
