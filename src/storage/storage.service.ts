import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage } from './entities/storage.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  async createOne(createStorageDto: CreateStorageDto): Promise<Storage> {
    return await this.storageRepo.save(createStorageDto);
  }

  async findAll(): Promise<Storage[]> {
    return await this.storageRepo.find();
  }

  async findOne(id: number): Promise<Storage> {
    return await this.storageRepo.findOneOrFail(id);
  }

  async updateOne(
    id: number,
    updateStorageDto: UpdateStorageDto,
  ): Promise<Storage> {
    return await this.storageRepo.save({ id: id, ...updateStorageDto });
  }

  async remove(id: number): Promise<void> {
    await this.storageRepo.delete(id);
  }
}
