import { Test, TestingModule } from '@nestjs/testing';
import { StorageTransactionService } from './storage-transaction.service';

describe('StorageTransactionService', () => {
  let service: StorageTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageTransactionService],
    }).compile();

    service = module.get<StorageTransactionService>(StorageTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
