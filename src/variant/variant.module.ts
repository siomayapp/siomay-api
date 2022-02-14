import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { Variant } from './entities/variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantSeederService } from './seeds';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  controllers: [VariantController],
  providers: [VariantService, VariantSeederService],
  exports: [VariantService, VariantSeederService],
})
export class VariantModule {}
