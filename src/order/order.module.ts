import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantModule } from '../variant/variant.module';
import { OrderHistoryModule } from '../order-history/order-history.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Users]),
    VariantModule,
    OrderHistoryModule,
    StorageModule,
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
