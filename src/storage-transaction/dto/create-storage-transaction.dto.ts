import { Storage } from '../../storage/entities/storage.entity';
import { StorageTransactionType } from '../entities/storage-transaction.entity';

export class CreateStorageTransactionDto {
  transactionType: StorageTransactionType;
  box: string;
  variant: string;
  amount: number;
}
