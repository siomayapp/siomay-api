import * as argon2 from 'argon2';
import {
  HttpException,
  HttpStatus,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Users } from '../users/users.entity';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponseData } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(inputUser: Users): Promise<Users> {
    try {
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(inputUser.password, { salt });
      inputUser.password = hashedPassword;
      inputUser.salt = salt.toString('hex');
      const createdUser = await this.usersService.createOne(inputUser);
      Reflect.deleteProperty(createdUser, 'password');
      Reflect.deleteProperty(createdUser, 'salt');
      return createdUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<IAuthResponseData> {
    try {
      const userRecord = await this.usersService.findByUsername(username, true);

      if (!userRecord || userRecord === undefined) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const validPassword = await argon2.verify(userRecord.password, password);

      if (!validPassword) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      Reflect.deleteProperty(userRecord, 'password');

      const token = this.jwtService.sign({ ...userRecord });

      return { user: userRecord, token: token };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
