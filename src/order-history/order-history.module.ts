import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryController } from './order-history.controller';
import { OrderHistory } from './entities/order-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistoryDistributor } from './entities/order-history-distributor';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistory, OrderHistoryDistributor])],
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService],
  exports: [OrderHistoryService],
})
export class OrderHistoryModule {}
