import { UpdateStorageAmountDto } from '../dto/update-storage-amount.dto';
import { Storage } from '../entities/storage.entity';

export interface IFilterStorage {
  variant: number;
}

export interface IUpdateAmountParams {
  updateAmountDto: UpdateStorageAmountDto;
  id?: number;
  boxName?: string;
  isUpdatingOrder?: boolean;
  storage?: Storage;
  isProcessingOrder?: boolean;
  orderId?: number;
}
