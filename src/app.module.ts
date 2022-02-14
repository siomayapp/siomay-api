import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
// import { CookieAuthenticationGuard } from './auth/guard/cookie-auth.guard';
import { RolesGuard } from './users/guard/user.role.guard';
import { StorageModule } from './storage/storage.module';
import { OrderModule } from './order/order.module';
import { devDb } from './config/db';
import { VariantModule } from './variant/variant.module';
import { StorageTransactionModule } from './storage-transaction/storage-transaction.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeederModule } from './seeder.module';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    TypeOrmModule.forRoot({
      type: 'postgres' as any,
      ...devDb,
      synchronize: true,
      schema: 'public',
      // logger: 'file',
      // logging: true,
      timezone: process.env.DB_TZ,
      autoLoadEntities: true,
      maxQueryExecutionTime: 5000,
    }),
    // RedisCacheModule,
    AuthModule,
    UsersModule,
    StorageModule,
    VariantModule,
    StorageTransactionModule,
    OrderModule,
    OrderHistoryModule,
    DashboardModule,
    SeederModule,
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
    Logger,
  ],
})
export class AppModule {}
