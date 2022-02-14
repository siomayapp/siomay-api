import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Roles } from '../shared/decorators';
import { UserRole } from '../users/entities/users.role.enum';
import { HttpResponse } from '../shared/types';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  @Roles(UserRole.OWNER)
  async create(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<HttpResponse> {
    const data = await this.variantService.create(createVariantDto);
    return { isSuccess: true, data };
  }

  @Get()
  async findAll(): Promise<HttpResponse> {
    const data = await this.variantService.findAll();
    return { isSuccess: true, data };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.variantService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
  //   return this.variantService.update(+id, updateVariantDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpResponse> {
    await this.variantService.remove(+id);
    return { isSuccess: true };
  }
}
