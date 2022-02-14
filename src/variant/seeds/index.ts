import { Injectable } from '@nestjs/common';
// import { CreateVariantDto } from '../dto/create-variant.dto';
import { VariantService } from '../variant.service';
import { variants } from './data';

@Injectable()
export class VariantSeederService {
  constructor(private readonly variantService: VariantService) {}

  async createMany(): Promise<void> {
    // variants.map(async (variant: CreateVariantDto) => {
    //   await this.variantService.create(variant);
    // });
    await this.variantService.createMany(variants);
  }
}
