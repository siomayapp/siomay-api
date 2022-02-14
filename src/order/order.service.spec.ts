import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderHistoryService } from '../order-history/order-history.service';
import { StorageService } from '../storage/storage.service';
import { VariantService } from '../variant/variant.service';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepository = {};
  const mockVariantService = {};
  const mockOrderHistoryService = {};
  const mockStorageService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: VariantService,
          useValue: mockVariantService,
        },
        {
          provide: OrderHistoryService,
          useValue: mockOrderHistoryService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
