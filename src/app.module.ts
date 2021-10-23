import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
// import { CookieAuthenticationGuard } from './auth/guard/cookie-auth.guard';
import { RolesGuard } from './users/guard/user.role.guard';
import { StorageModule } from './storage/storage.module';
import { Storage } from './storage/entities/storage.entity';
import { OrderModule } from './order/order.module';
import { devDb, herokuDb } from './config/db';
import { VariantModule } from './variant/variant.module';
import { Variant } from './variant/entities/variant.entity';
import { StorageTransactionModule } from './storage-transaction/storage-transaction.module';
import { StorageTransaction } from './storage-transaction/entities/storage-transaction.entity';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { Order } from './order/entities/order.entity';

const dbConfig = herokuDb; //devDb

@Module({
  imports: [
    PassportModule.register({ session: false }),
    TypeOrmModule.forRoot({
      type: 'postgres' as any,
      ...dbConfig,
      entities: [Users, Storage, Variant, StorageTransaction, Order],
      synchronize: true,
      schema: 'public',
    }),
    // RedisCacheModule,
    AuthModule,
    UsersModule,
    StorageModule,
    VariantModule,
    StorageTransactionModule,
    OrderModule,
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
