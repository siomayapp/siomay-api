import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { IRequestHeader } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private redisCacheService: RedisCacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const reqHeaders = req.headers as IRequestHeader;
    const tokenFromRequest = reqHeaders.authorization.split('Bearer ')[1];
    const token = await this.redisCacheService.get(
      'token' + payload.id.toString(),
    );

    if (!token) {
      throw new UnauthorizedException();
    }

    if (tokenFromRequest != token) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
