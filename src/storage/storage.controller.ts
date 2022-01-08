import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Roles, Filter, Pagination } from 'src/shared/decorators';
import { UserRole } from 'src/users/entities/users.role.enum';
import { UpdateStorageAmountDto } from './dto/update-storage-amount.dto';
import { HttpResponse } from '../shared/types';
import { Response } from 'express';
import { FilterStorageDto } from './dto/filter-storage.dto';
import { PaginationDto } from '../shared/dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async create(
    @Body() createStorageDto: CreateStorageDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const data = await this.storageService.createOne(createStorageDto);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.STORAGE, UserRole.DISTRIBUTION)
  async findAll(
    @Filter() filter: FilterStorageDto,
    @Pagination() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const [data, count] = await this.storageService.findAll(
        pagination,
        filter,
      );
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, count, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const data = await this.storageService.findOne(+id);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async update(
    @Param('id') id: string,
    @Body() updateStorageDto: UpdateStorageDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const data = await this.storageService.updateOne(+id, updateStorageDto);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Patch('update-amount/:id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async updateAmount(
    @Param('id') id: string,
    @Body() updateAmountDto: UpdateStorageAmountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      const data = await this.storageService.updateAmount({
        updateAmountDto: updateAmountDto,
        id: +id,
      });
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, data, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async remove(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const start = process.hrtime();
      await this.storageService.remove(+id);
      const end = process.hrtime(start);
      const exec_time = end[0] * 1000 + end[1] / 1000000;
      return { isSuccess: true, exec_time };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }
}
