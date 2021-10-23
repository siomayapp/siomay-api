import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageTransactionService } from '../storage-transaction/storage-transaction.service';
import { Variant } from '../variant/entities/variant.entity';
import { VariantService } from '../variant/variant.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageAmountDto } from './dto/update-storage-amount.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage } from './entities/storage.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
    private readonly variantService: VariantService,
    private readonly stService: StorageTransactionService,
  ) {}

  async createOne(createStorageDto: CreateStorageDto): Promise<Storage> {
    let newStorage = await this.storageRepo.save(createStorageDto);
    newStorage = await this.storageRepo.preload(newStorage);
    // s
    const variant = await this.variantService.updateStock(
      newStorage.variant.id,
      newStorage.amount,
    );
    await this.stService.create({
      transactionType: 'in',
      box: newStorage.boxName,
      variant: variant.name,
      amount: newStorage.amount,
    });
    return await this.findOne(newStorage.id);
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
    id: number,
    updateAmountDto: UpdateStorageAmountDto,
  ): Promise<Storage> {
    const storage = await this.findOne(id);
    let relatedVariant: Variant;

    if (updateAmountDto.updateAmountType == 'in') {
      storage.amount += updateAmountDto.amount;
      relatedVariant = await this.variantService.updateStock(
        storage.variant.id,
        updateAmountDto.amount,
      );
    } else if (updateAmountDto.updateAmountType == 'out') {
      if (storage.amount - updateAmountDto.amount < 0) {
        throw new HttpException(
          'Storage amount should not be less than 0',
          HttpStatus.BAD_REQUEST,
        );
      }
      storage.amount -= updateAmountDto.amount;
      relatedVariant = await this.variantService.updateOut(
        storage.variant.id,
        updateAmountDto.amount,
      );
    }

    storage.variant = relatedVariant;
    await this.storageRepo.save(storage);

    await this.stService.create({
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
