import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { FilterStorageDto } from './dto/request-query.dto';
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
      const data = await this.storageService.createOne(createStorageDto);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async findAll(
    @Filter() filter: FilterStorageDto,
    @Pagination() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const [data, lastRowId] = await this.storageService.findAll(
        pagination,
        filter,
      );
      return { isSuccess: true, data, lastRow: lastRowId };
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
      const data = await this.storageService.findOne(+id);
      return { isSuccess: true, data };
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
      const data = await this.storageService.updateOne(+id, updateStorageDto);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Patch('update-amount/:id')
  @Roles(UserRole.OWNER, UserRole.STORAGE)
  async updateAmount(
    @Param('id') id: string,
    @Body() updateStorageDto: UpdateStorageAmountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const data = await this.storageService.updateAmount(
        updateStorageDto,
        +id,
      );
      return { isSuccess: true, data };
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
      await this.storageService.remove(+id);
      return { isSuccess: true };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }
}
