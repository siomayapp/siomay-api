import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiFile, Public } from '../shared/decorators';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { IRequestWithUser } from './types';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiFile({
    allowedTypes: ['image/jpeg', 'image/png'],
    destination: 'public/uploads/avatar',
  })
  @Post('register')
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() registrationData: CreateUserDto,
  ) {
    registrationData.avatar = file.originalname;
    return await this.authService.register(registrationData);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IRequestWithUser) {
    return req.user;
  }

  @Post('logout')
  async logout(@Request() req: IRequestWithUser) {
    await this.authService.logout(req.user.id);
    return 'OK';
  }
}
