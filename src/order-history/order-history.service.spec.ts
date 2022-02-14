import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderHistoryDistributor } from './entities/order-history-distributor';
import { OrderHistory } from './entities/order-history.entity';
import { OrderHistoryService } from './order-history.service';

describe('OrderHistoryService', () => {
  let service: OrderHistoryService;

  const mockOrderHistoryRepo = {};
  const mockOrderHistoryDistRepo = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderHistoryService,
        {
          provide: getRepositoryToken(OrderHistory),
          useValue: mockOrderHistoryRepo,
        },
        {
          provide: getRepositoryToken(OrderHistoryDistributor),
          useValue: mockOrderHistoryDistRepo,
        },
      ],
    }).compile();

    service = module.get<OrderHistoryService>(OrderHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
