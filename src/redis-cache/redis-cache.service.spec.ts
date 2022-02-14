import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheService } from './redis-cache.service';

describe('RedisCacheService', () => {
  let service: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
