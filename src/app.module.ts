import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
// import { CookieAuthenticationGuard } from './auth/guard/cookie-auth.guard';
import { RolesGuard } from './users/guard/user.role.guard';
import { StorageModule } from './storage/storage.module';
import { Storage } from './storage/entities/storage.entity';
import { OrderModule } from './order/order.module';
import { devDb, herokuDb } from './config/db';

const dbConfig = herokuDb; //herokuDb

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    PassportModule.register({ session: false }),
    TypeOrmModule.forRoot({
      type: 'postgres' as any,
      ...dbConfig,
      entities: [Users, Storage],
      synchronize: true,
      schema: 'public',
    }),
    AuthModule,
    StorageModule,
    // OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      // useClass: CookieAuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
