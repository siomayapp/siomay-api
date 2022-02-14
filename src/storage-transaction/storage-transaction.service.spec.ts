import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StorageTransaction } from './entities/storage-transaction.entity';
import { StorageTransactionService } from './storage-transaction.service';

describe('StorageTransactionService', () => {
  let service: StorageTransactionService;

  const mockStorageTransactionRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageTransactionService,
        {
          provide: getRepositoryToken(StorageTransaction),
          useValue: mockStorageTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<StorageTransactionService>(StorageTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
