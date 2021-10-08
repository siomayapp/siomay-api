import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { IAuthResponseData } from '../types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(
    payload: IAuthResponseData,
    done: (err: Error, payload: IAuthResponseData) => void,
  ) {
    done(null, payload);
  }

  async deserializeUser(
    payload: IAuthResponseData,
    done: (err: Error, user: any) => void,
  ) {
    const userRecord = await this.usersService.findByUsername(
      payload.user.username,
      false,
    );
    return userRecord ? done(null, userRecord) : done(null, null);
  }
}
