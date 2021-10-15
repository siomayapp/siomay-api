import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStorageTransactionDto } from './dto/create-storage-transaction.dto';
import { StorageTransaction } from './entities/storage-transaction.entity';

@Injectable()
export class StorageTransactionService {
  constructor(
    @InjectRepository(StorageTransaction)
    private readonly stRepo: Repository<StorageTransaction>,
  ) {}

  async create(
    createStorageTransactionDto: CreateStorageTransactionDto,
  ): Promise<void> {
    await this.stRepo.save(createStorageTransactionDto);
  }

  // findAll() {
  //   return `This action returns all storageTransaction`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} storageTransaction`;
  // }

  // update(id: number, updateStorageTransactionDto: UpdateStorageTransactionDto) {
  //   return `This action updates a #${id} storageTransaction`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} storageTransaction`;
  // }
}
