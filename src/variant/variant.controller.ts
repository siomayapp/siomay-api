import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Roles } from 'src/shared/decorators';
import { UserRole } from 'src/users/entities/users.role.enum';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post()
  @Roles(UserRole.OWNER)
  async create(@Body() createVariantDto: CreateVariantDto) {
    return await this.variantService.create(createVariantDto);
  }

  // @Get()
  // findAll() {
  //   return this.variantService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.variantService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
  //   return this.variantService.update(+id, updateVariantDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.variantService.remove(+id);
      return 'OK';
    } catch (error) {
      console.log(error);
      return 'Failed';
    }
  }
}
