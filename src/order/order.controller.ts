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
import { Roles } from '../shared/decorators';
import { UserRole } from '../users/entities/users.role.enum';
import { Response } from 'express';
import { HttpResponse } from '../shared/types';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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
      const data = await this.orderService.create(createOrderDto);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async findAll(
    @Query('last') last: string,
    @Query('limit') limit: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const [data, lastRowId] = await this.orderService.findAll(+last, +limit);
      return { isSuccess: true, data, lastRow: lastRowId };
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
      const data = await this.orderService.findOne(+id);
      return { isSuccess: true, data };
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
      await this.orderService.updateStatus(+id, updateOrderStatusDto);
      return { isSuccess: true };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async remove(@Param('id') id: string) {
    try {
      await this.orderService.remove(+id);
      return 'OK';
    } catch (error) {
      return error;
    }
  }
}
