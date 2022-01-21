import * as argon2 from 'argon2';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entities/users.entity';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { IAuthResponseData } from './types';
import { CreateUserDto } from '../users/dto/create-user.dto';
// import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // private redisCacheService: RedisCacheService,
  ) {}

  async register(inputUser: CreateUserDto): Promise<Users> {
    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(inputUser.password, { salt });
    inputUser.password = hashedPassword;
    inputUser.salt = salt.toString('hex');
    const createdUser = await this.usersService.createOne(inputUser);
    Reflect.deleteProperty(createdUser, 'password');
    Reflect.deleteProperty(createdUser, 'salt');
    return createdUser;
  }

  async login(username: string, password: string): Promise<IAuthResponseData> {
    const userRecord = await this.usersService.findByUsername(username, true);

    if (!userRecord || userRecord === undefined) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const validPassword = await argon2.verify(userRecord.password, password);

    if (!validPassword) {
      throw new UnauthorizedException('Username atau password salah');
    }

    Reflect.deleteProperty(userRecord, 'password');

    const token = this.jwtService.sign({ ...userRecord });
    // await this.redisCacheService.set(
    //   'token' + userRecord.id.toString(),
    //   token,
    // );

    return { user: userRecord, token: token };
  }

  async logout(userId: number): Promise<void> {
    // await this.redisCacheService.delete('token' + userId.toString());
  }
}
