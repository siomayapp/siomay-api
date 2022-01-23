import { Controller, Get } from '@nestjs/common';
import { Roles } from '../shared/decorators';
import { HttpResponse } from '../shared/types';
import { UserRole } from '../users/entities/users.role.enum';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('get-total-order')
  @Roles(UserRole.OWNER)
  async getTotalOrder(): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.dashboardService.getTotalOrder();
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Get('get-total-sold')
  @Roles(UserRole.OWNER)
  async getTotalSold(): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.dashboardService.getTotalSold();
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Get('get-sold-variant')
  @Roles(UserRole.OWNER)
  async getSoldVariant(): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.dashboardService.getSoldVariant();
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Get('get-total-stock')
  @Roles(UserRole.OWNER)
  async getTotalStock(): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = await this.dashboardService.getTotalStock();
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  // @Get('get-today-orders')
  // @Roles(UserRole.OWNER)
  // async getTodayOrderList(
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<HttpResponse> {
  //   try {
  //     const start = process.hrtime();
  //     const data = await this.dashboardService.getTodayOrderList();
  //     const end = process.hrtime(start);
  //     const exec_time = end[0] * 1000 + end[1] / 1000000;
  //     return { isSuccess: true, data, exec_time };
  //   } catch (error) {
  //     res.status(500);
  //     return { isSuccess: false, error: error.message };
  //   }
  // }
}
