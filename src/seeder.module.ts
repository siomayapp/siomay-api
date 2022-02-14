import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SeederService } from './seeder.service';
import { VariantModule } from './variant/variant.module';

@Module({
  imports: [VariantModule, AuthModule],
  providers: [SeederService],
})
export class SeederModule {}
