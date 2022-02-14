import { Injectable, Logger } from '@nestjs/common';
import { AuthSeederService } from './auth/seeds';
import { VariantSeederService } from './variant/seeds';

@Injectable()
export class SeederService {
  constructor(
    private readonly variantSeederService: VariantSeederService,
    private readonly authSeederService: AuthSeederService,
  ) {
    this.run();
  }

  async run(): Promise<void> {
    this.variantSeederService
      .createMany()
      .then(() => {
        Logger.log('Successfully completed seeding variants...');
        // Promise.resolve();
      })
      .catch((err) => {
        Logger.error('Failed seeding variants...');
        // Logger.error(err);
        // Promise.reject(err);
      });

    this.authSeederService
      .createOwner()
      .then(() => {
        Logger.log('Successfully completed seeding user owner...');
        // Promise.resolve();
      })
      .catch((err) => {
        Logger.error('Failed seeding user owner...');
        // Logger.error(err);
        // Promise.reject(err);
      });
  }
}
