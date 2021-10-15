import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Roles } from 'src/shared/decorators';
import { UserRole } from 'src/users/entities/users.role.enum';
import { UpdateStorageAmountDto } from './dto/update-storage-amount.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async create(@Body() createStorageDto: CreateStorageDto): Promise<any> {
    return await this.storageService.createOne(createStorageDto);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async findAll(): Promise<any> {
    return await this.storageService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.storageService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async update(
    @Param('id') id: string,
    @Body() updateStorageDto: UpdateStorageDto,
  ): Promise<any> {
    return this.storageService.updateOne(+id, updateStorageDto);
  }

  @Patch('update-amount/:id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async updateAmount(
    @Param('id') id: string,
    @Body() updateStorageDto: UpdateStorageAmountDto,
  ): Promise<any> {
    return this.storageService.updateAmount(+id, updateStorageDto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async remove(@Param('id') id: string): Promise<any> {
    try {
      await this.storageService.remove(+id);
      return 'OK';
    } catch (error) {
      return error;
    }
  }
}
