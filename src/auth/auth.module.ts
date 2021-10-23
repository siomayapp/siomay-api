import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
// import { SessionSerializer } from './utils/Serializer';rrrrrrr

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '120s' },
    }),
    // RedisCacheModule,
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], //SessionSerializer
  controllers: [AuthController],
})
export class AuthModule {}
