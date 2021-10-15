import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { VariantModule } from 'src/variant/variant.module';
import { StorageTransactionModule } from '../storage-transaction/storage-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Storage]),
    VariantModule,
    StorageTransactionModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
