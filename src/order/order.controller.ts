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
import { Roles } from '../shared/decorators';
import { UserRole } from '../users/entities/users.role.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(+id, updateOrderDto);
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
