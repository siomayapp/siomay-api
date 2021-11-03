import { Controller, Get, Post, Res, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiFile, Public } from './shared/decorators';
import { HttpResponse } from './shared/types';
import { Response } from 'express';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Public()
  @ApiFile({
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    destination: 'public/uploads/avatar',
  })
  @Post('upload-avatar')
  async uploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      console.log(file);
      if (!file) {
        res.status(400);
        return { isSuccess: false, error: 'Gagal upload avatar' };
      }

      // registrationData.avatar = file.originalname;
      // const data = await this.authService.register(registrationData);
      return { isSuccess: true };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }
}
