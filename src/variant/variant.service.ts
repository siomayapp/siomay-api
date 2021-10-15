import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariantDto } from './dto/create-variant.dto';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    return await this.variantRepo.save(createVariantDto);
  }

  // findAll() {
  //   return `This action returns all variant`;
  // }

  async findOne(id: number): Promise<Variant> {
    return await this.variantRepo.findOneOrFail(id);
  }

  // update(id: number, updateVariantDto: UpdateVariantDto) {
  //   return `This action updates a #${id} variant`;
  // }

  async updateStock(id: number, amount: number): Promise<Variant> {
    const variant = await this.findOne(id);
    variant.stock += amount;
    return await this.variantRepo.save(variant);
  }

  async updateOut(id: number, amount: number): Promise<Variant> {
    const variant = await this.findOne(id);
    variant.out += amount;
    variant.stock -= amount;
    return await this.variantRepo.save(variant);
  }

  async remove(id: number): Promise<void> {
    await this.variantRepo.delete(id);
  }
}
