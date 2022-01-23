import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Filter, Pagination, Roles } from '../shared/decorators';
import { PaginationDto } from '../shared/dto';
import { HttpResponse } from '../shared/types';
import { FilterUserDto } from './dto/request-query.dto';
import { UserRole } from './entities/users.role.enum';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.DISTRIBUTION)
  async getAllUsers(
    @Filter() filter: FilterUserDto,
    @Pagination() pagination: PaginationDto,
  ): Promise<HttpResponse> {
    const start = process.hrtime();
    const [data, count] = await this.usersService.findAll(pagination, filter);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, count, exec_time };
  }

  @Get(':id')
  @Roles(UserRole.OWNER)
  async getUser(@Param('id') id: string): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.usersService.findOne(+id);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserData: any,
  ): Promise<any> {
    const start = process.hrtime();
    const data = await this.usersService.updateOne(+id, updateUserData);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  async deleteUser(@Param('id') id: string): Promise<any> {
    const start = process.hrtime();
    this.usersService.remove(+id);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, exec_time };
  }

  @Get('get-avatar/:avatar')
  async getUserAvatar(
    @Param('avatar') avatar: string,
    @Res() res: Response,
  ): Promise<any> {
    return res.sendFile(join('uploads/avatar/', avatar), { root: 'public' });
  }
}
