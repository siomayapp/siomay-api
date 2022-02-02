import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPagination } from '../shared/types';
import { StorageTransactionService } from '../storage-transaction/storage-transaction.service';
// import { Variant } from '../variant/entities/variant.entity';
import { VariantService } from '../variant/variant.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage } from './entities/storage.entity';
import { IFilterStorage, IUpdateAmountParams } from './types';

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
  ): Promise<[Storage[], number]> {
    const result = await this.storageRepo.findAndCount({
      where: { ...filter },
      skip: (pagination.page - 1) * pagination.per_page,
      take: pagination.per_page,
      order: { filledDate: 'ASC' },
    });
    return result;
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
    if (updateStorageDto == undefined || updateStorageDto.amount == 0) {
      throw new BadRequestException('Jumlah tidak boleh kosong');
    }

    const storage = await this.findOne(id);
    if (storage.amount != 0) {
      throw new BadRequestException(
        'Tidak dapat update storage, karena storage tidak kosong',
      );
    }

    if (
      updateStorageDto.variant != undefined &&
      +updateStorageDto.variant != storage.variant.id
    ) {
      storage.variant.id = +updateStorageDto.variant;
    }
    storage.filledDate = new Date();

    // await this.storageRepo.save(storage);
    return await this.updateAmount({
      updateAmountDto: {
        updateAmountType: 'in',
        amount: updateStorageDto.amount,
      },
      isUpdatingOrder: true,
      storage: storage,
    });
  }

  async updateAmount({
    updateAmountDto,
    id,
    boxName,
    isUpdatingOrder = false,
    storage,
    isProcessingOrder = false,
    orderId,
  }: IUpdateAmountParams): Promise<Storage> {
    if (!isUpdatingOrder) {
      storage = await this.findOne(id, boxName);
    }

    if (updateAmountDto.updateAmountType == 'in') {
      storage.amount += updateAmountDto.amount;
    } else {
      if (storage.amount - updateAmountDto.amount < 0) {
        throw new BadRequestException('Isi storage tidak boleh kurang dari 0');
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
      orderId: isProcessingOrder ? orderId : undefined,
    });

    return await this.findOne(storage.id);
  }

  async remove(id: number): Promise<void> {
    const storage = await this.storageRepo.findOneOrFail(id, {
      select: ['amount'],
    });

    if (storage.amount != 0) {
      throw new BadRequestException(
        'Tidak dapat menghapus storage, karena storage tidak kosong',
      );
    }

    await this.storageRepo.delete(id);
  }
}
