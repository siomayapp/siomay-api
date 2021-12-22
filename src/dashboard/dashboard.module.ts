import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { OrderModule } from '../order/order.module';
import { VariantModule } from '../variant/variant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Variant } from '../variant/entities/variant.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    TypeOrmModule.forFeature([Order, Variant]),
    OrderModule,
    VariantModule,
  ],
})
export class DashboardModule {}
