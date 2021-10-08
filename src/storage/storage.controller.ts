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
import { UserRole } from 'src/users/users.role.enum';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @Roles(UserRole.OWNER)
  async create(@Body() createStorageDto: CreateStorageDto): Promise<any> {
    return await this.storageService.createOne(createStorageDto);
  }

  @Get()
  @Roles(UserRole.OWNER)
  async findAll(): Promise<any> {
    return await this.storageService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.OWNER)
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.storageService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  async update(
    @Param('id') id: string,
    @Body() updateStorageDto: UpdateStorageDto,
  ): Promise<any> {
    return this.storageService.updateOne(+id, updateStorageDto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  async remove(@Param('id') id: string): Promise<any> {
    try {
      await this.storageService.remove(+id);
      return 'OK';
    } catch (error) {
      return error;
    }
  }
}
