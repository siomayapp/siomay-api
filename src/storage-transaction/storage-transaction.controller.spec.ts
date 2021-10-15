import { Test, TestingModule } from '@nestjs/testing';
import { StorageTransactionController } from './storage-transaction.controller';
import { StorageTransactionService } from './storage-transaction.service';

describe('StorageTransactionController', () => {
  let controller: StorageTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageTransactionController],
      providers: [StorageTransactionService],
    }).compile();

    controller = module.get<StorageTransactionController>(
      StorageTransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
