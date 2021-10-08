import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { Roles } from '../shared/decorators';
import { UserRole } from './users.role.enum';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.OWNER)
  async getAllUsers(): Promise<any[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.OWNER)
  async getUser(@Param('id') id: string): Promise<any> {
    return await this.usersService.findOne(parseInt(id));
  }

  @Patch(':id')
  @Roles(UserRole.OWNER)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserData: any,
  ): Promise<any> {
    return await this.usersService.updateOne(parseInt(id), updateUserData);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  async deleteUser(@Param('id') id: string): Promise<any> {
    try {
      this.usersService.remove(parseInt(id));
      return 'OK';
    } catch (error) {
      return error;
    }
  }
}
