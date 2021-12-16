import { HttpException, HttpStatus, Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { IPagination } from '../shared/types';
import { StorageTransactionService } from '../storage-transaction/storage-transaction.service';
import { Variant } from '../variant/entities/variant.entity';
import { VariantService } from '../variant/variant.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageAmountDto } from './dto/update-storage-amount.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage } from './entities/storage.entity';
import { IFilterStorage } from './types';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
    private readonly variantService: VariantService,
    private readonly storageTransactionService: StorageTransactionService,
  ) {}

  async createOne(createStorageDto: CreateStorageDto): Promise<Storage> {
    let newStorage = await this.storageRepo.save(createStorageDto);
    newStorage = await this.storageRepo.preload(newStorage);
    // s
    const variant = await this.variantService.updateStock(
      newStorage.variant.id,
      'in',
      newStorage.amount,
    );
    await this.storageTransactionService.create({
      transactionType: 'in',
      box: newStorage.boxName,
      variant: variant.name,
      amount: newStorage.amount,
    });
    return await this.findOne(newStorage.id);
  }

  async findAll(
    pagination: IPagination,
    filter: IFilterStorage,
  ): Promise<[Storage[], number | null]> {
    const storages = await this.storageRepo.find({
      where: { id: MoreThan(pagination.last), ...filter },
      take: pagination.limit,
    });
    const lastRow =
      storages.length > 0 ? storages[storages.length - 1].id : null;
    return [storages, lastRow];
  }

  async findOne(id?: number, boxName?: string): Promise<Storage> {
    return await this.storageRepo.findOneOrFail({
      where: [{ id: id }, { boxName: boxName }],
    });
  }

  async updateOne(
    id: number,
    updateStorageDto: UpdateStorageDto,
  ): Promise<Storage> {
    if (updateStorageDto.variant) {
      const storage = await this.findOne(id);
      if (storage.variant != updateStorageDto.variant && storage.amount != 0) {
        throw new HttpException(
          'Cannot update variant, because storage amout is not 0',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.storageRepo.save({ id: id, ...updateStorageDto });
  }

  async updateAmount(
    updateAmountDto: UpdateStorageAmountDto,
    id?: number,
    boxName?: string,
  ): Promise<Storage> {
    const storage = await this.findOne(id, boxName);

    if (updateAmountDto.updateAmountType == 'in') {
      storage.amount += updateAmountDto.amount;
    } else {
      if (storage.amount - updateAmountDto.amount < 0) {
        throw new HttpException(
          'Storage amount should not be less than 0',
          HttpStatus.BAD_REQUEST,
        );
      }
      storage.amount -= updateAmountDto.amount;
    }

    const relatedVariant = await this.variantService.updateStock(
      storage.variant.id,
      updateAmountDto.updateAmountType,
      updateAmountDto.amount,
    );

    storage.variant = relatedVariant;
    await this.storageRepo.save(storage);

    await this.storageTransactionService.create({
      transactionType: updateAmountDto.updateAmountType,
      box: storage.boxName,
      variant: relatedVariant.name,
      amount: updateAmountDto.amount,
    });

    return await this.findOne(storage.id);
  }

  async remove(id: number): Promise<void> {
    const storage = await this.storageRepo.findOneOrFail(id, {
      select: ['amount'],
    });

    if (storage.amount != 0) {
      throw new HttpException(
        'Cannot delete storage, because storage amount is not 0',
        400,
      );
    }

    await this.storageRepo.delete(id);
  }
}
