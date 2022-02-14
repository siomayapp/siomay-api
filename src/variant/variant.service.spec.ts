import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantService } from './variant.service';

describe('VariantService', () => {
  let service: VariantService;

  const mockVariantRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantService,
        {
          provide: getRepositoryToken(Variant),
          useValue: mockVariantRepository,
        },
      ],
    }).compile();

    service = module.get<VariantService>(VariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
