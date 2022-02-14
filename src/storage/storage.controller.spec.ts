import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

describe('StorageController', () => {
  let controller: StorageController;

  const mockStorageService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [StorageService],
    })
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
