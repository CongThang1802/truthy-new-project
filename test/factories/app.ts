import { ThrottlerModule } from '@nestjs/throttler';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis, { Redis as TypeRedis } from 'ioredis';

import { AppModule } from 'src/app.module';
import { appDataSource } from 'src/config/ormconfig';

export class AppFactory {
  private constructor(
    private readonly appInstance: INestApplication,
    private readonly redis: TypeRedis
  ) {}

  get instance() {
    return this.appInstance;
  }

  static async new() {
    const redis = await setupRedis();
    const moduleBuilder = Test.createTestingModule({
      imports: [
        AppModule,
        ThrottlerModule.forRootAsync({
          useFactory: () => {
            return {
              ttl: 60,
              limit: 60,
              storage: new ThrottlerStorageRedisService(redis)
            };
          }
        })
      ]
    })
      .overrideProvider('LOGIN_THROTTLE')
      .useFactory({
        factory: () => {
          return new RateLimiterRedis({
            storeClient: redis,
            keyPrefix: 'login',
            points: 5,
            duration: 60 * 60 * 24 * 30, // Store number for 30 days since first fail
            blockDuration: 3000
          });
        }
      });

    const module = await moduleBuilder.compile();

    const app = module.createNestApplication(undefined, {
      logger: false
    });

    await app.init();

    return new AppFactory(app, redis);
  }

  async close() {
    await appDataSource.dropDatabase();
    if (this.redis) await this.teardown(this.redis);
    if (this.appInstance) await this.appInstance.close();
  }

  static async cleanupDB() {
    const tables = appDataSource.entityMetadatas.map(
      (entity) => `"${entity.tableName}"`
    );

    for (const table of tables) {
      await appDataSource.query(`DELETE FROM ${table};`);
    }
  }

  static async dropTables() {
    await appDataSource.query(`SET session_replication_role = 'replica';`);
    const tables = appDataSource.entityMetadatas.map(
      (entity) => `"${entity.tableName}"`
    );
    for (const tableName of tables) {
      await appDataSource.query(`DROP TABLE IF EXISTS ${tableName};`);
    }

    await appDataSource.destroy();
  }

  async teardown(redis: TypeRedis) {
    return new Promise<void>((resolve) => {
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}

const setupRedis = async () => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379
  });
  await redis.flushall();
  return redis;
};
