import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const devDb: TypeOrmModuleOptions = {
  type: 'postgres' as any,
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  schema: 'public',
  logger: 'advanced-console',
  logging: true,
  timezone: process.env.DB_TZ,
  autoLoadEntities: true,
  maxQueryExecutionTime: 5000,
};
