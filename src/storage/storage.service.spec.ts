import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StorageTransactionService } from '../storage-transaction/storage-transaction.service';
import { VariantService } from '../variant/variant.service';
import { Storage } from './entities/storage.entity';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const mockStorageRepository = {};
  const mockVariantService = {};
  const mockStorageTransactionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: getRepositoryToken(Storage),
          useValue: mockStorageRepository,
        },
        {
          provide: VariantService,
          useValue: mockVariantService,
        },
        {
          provide: StorageTransactionService,
          useValue: mockStorageTransactionService,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
