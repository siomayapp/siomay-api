import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiFile, Public } from '../shared/decorators';
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      // if (!file) {
      //   res.status(400);
      //   return { isSuccess: false, error: 'Cannot save avatar' };
      // }
      // registrationData.avatar = file.originalname;
      const data = await this.authService.register(registrationData);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpResponse> {
    try {
      const data = req.user;
      res.status(HttpStatus.OK);
      return { isSuccess: true, data };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }

  @Post('logout')
  async logout(
    @Request() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await this.authService.logout(req.user.id);
      return { isSuccess: true };
    } catch (error) {
      res.status(500);
      return { isSuccess: false, error: error.message };
    }
  }
}
