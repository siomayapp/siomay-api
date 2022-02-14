import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { StorageTransaction } from '../storage-transaction/entities/storage-transaction.entity';
import { Variant } from '../variant/entities/variant.entity';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockOrderRepository = {};
  const mockVariantRepository = {};
  const mockStorageTransactionRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Variant),
          useValue: mockVariantRepository,
        },
        {
          provide: getRepositoryToken(StorageTransaction),
          useValue: mockStorageTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
