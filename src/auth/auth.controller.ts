import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../shared/decorators';
import { Users } from '../users/users.entity';
import { AuthService } from './auth.service';
import { CookieAuthenticationGuard } from './guard/cookie-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { IRequestWithUser } from './types';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: Users) {
    return await this.authService.register(registrationData);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: IRequestWithUser) {
    return req.user;
  }

  // @Post('logout')
  // async logout(@Request() req: IRequestWithUser) {
  //   req.logOut();
  //   req.session.cookie.maxAge = 0;
  //   return 'OK';
  // }
}
