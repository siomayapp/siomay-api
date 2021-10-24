import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Roles } from '../shared/decorators';
import { HttpResponse } from '../shared/types';
import { UserRole } from './entities/users.role.enum';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.OWNER)
  async getAllUsers(
    @Query('last') last: string,
    @Query('limit') limit: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const [data, lastRow] = await this.usersService.findAll(+last, +limit);
      return { isSuccess: true, data, lastRow };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get(':id')
  @Roles(UserRole.OWNER)
  async getUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const data = await this.usersService.findOne(+id);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserData: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const data = await this.usersService.updateOne(+id, updateUserData);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  async deleteUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      this.usersService.remove(+id);
      return { isSuccess: true };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Get('get-avatar/:avatar')
  async getUserAvatar(
    @Param('avatar') avatar: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      return res.sendFile(join('uploads/avatar/', avatar), { root: 'public' });
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }
}
