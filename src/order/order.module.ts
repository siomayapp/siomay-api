import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantModule } from '../variant/variant.module';
import { OrderHistoryModule } from '../order-history/order-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    VariantModule,
    OrderHistoryModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
