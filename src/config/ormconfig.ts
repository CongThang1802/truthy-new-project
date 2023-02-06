import * as config from 'config';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();
const dbConfig = config.get<any>('db');
export const ormConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: process.env.DB_TYPE || dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: +process.env.DB_PORT || +dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE_NAME || dbConfig.database,
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  migrationsTransactionMode: 'each',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: false,
  synchronize: false,
  migrationsRun: process.env.NODE_ENV === 'test',
  dropSchema: process.env.NODE_ENV === 'test',
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}']
  // cli: {
  //   migrationsDir: 'src/database/migrations'
  // }
};
export const appDataSource = new DataSource(ormConfig as DataSourceOptions);
appDataSource.initialize();
