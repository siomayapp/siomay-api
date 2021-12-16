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

  async findAll(): Promise<Variant[]> {
    return await this.variantRepo.find();
  }

  async findOne(id: number, selectColumn?: string[]): Promise<Variant> {
    return selectColumn
      ? await this.variantRepo.findOneOrFail(id, {
          select: selectColumn as (keyof Variant)[],
        })
      : await this.variantRepo.findOneOrFail(id);
  }

  // update(id: number, updateVariantDto: UpdateVariantDto) {
  //   return `This action updates a #${id} variant`;
  // }

  async updateStock(
    id: number,
    type: 'in' | 'out',
    amount: number,
  ): Promise<Variant> {
    const variant = await this.findOne(id);
    if (type == 'in') {
      variant.stock += amount;
    } else {
      variant.stock -= amount;
      variant.out += amount;
    }
    return await this.variantRepo.save(variant);
  }

  // async updateOut(id: number, amount: number): Promise<Variant> {
  //   const variant = await this.findOne(id);
  //   return await this.variantRepo.save(variant);
  // }

  async remove(id: number): Promise<void> {
    await this.variantRepo.delete(id);
  }
}
