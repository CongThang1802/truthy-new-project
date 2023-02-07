import * as config from 'config';
import * as dotenv from 'dotenv';
dotenv.config();
const dbConfig = config.get<any>('db');
export default {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || dbConfig.host,
  port: +process.env.DB_PORT || +dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: false,
  synchronize: false,
  seeds: [__dirname + '/../database/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/../database/seeds/**/*{.ts,.js}']
};
