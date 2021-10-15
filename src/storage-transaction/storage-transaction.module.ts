import { Module } from '@nestjs/common';
import { StorageTransactionService } from './storage-transaction.service';
import { StorageTransactionController } from './storage-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageTransaction } from './entities/storage-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageTransaction])],
  controllers: [StorageTransactionController],
  providers: [StorageTransactionService],
  exports: [StorageTransactionService],
})
export class StorageTransactionModule {}
