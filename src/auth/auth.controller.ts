import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../shared/decorators';
import { HttpResponse } from '../shared/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { IRequestWithUser } from './types';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiFile({
  //   allowedTypes: ['image/jpeg', 'image/png'],
  //   destination: 'public/uploads/avatar',
  // })
  @Post('register')
  async register(
    // @UploadedFile() file: Express.Multer.File,
    @Body() registrationData: CreateUserDto,
  ): Promise<HttpResponse> {
    // if (!file) {
    //   res.status(400);
    //   return { isSuccess: false, error: 'Cannot save avatar' };
    // }
    // registrationData.avatar = file.originalname;
    const start = process.hrtime();
    const data = await this.authService.register(registrationData);
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IRequestWithUser): Promise<HttpResponse> {
    const start = process.hrtime();
    const data = req.user;
    const end = process.hrtime(start);
    const exec_time = end[0] * 1000 + end[1] / 1000000;
    return { isSuccess: true, data, exec_time };
  }

  @Post('logout')
  async logout(@Request() req: IRequestWithUser) {
    await this.authService.logout(req.user.id);
    return { isSuccess: true };
  }
}
