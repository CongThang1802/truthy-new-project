import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import Redis, { Redis as TypeRedis } from 'ioredis';
import * as config from 'config';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { UserRepository } from './user.repository';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { AuthService } from './auth.service';
import { UniqueValidatorPipe } from '../common/pipes/unique-validator.pipe';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { JwtTwoFactorStrategy } from '../common/strategy/jwt-two-factor.strategy';
import { RefreshTokenRepository } from '../refresh-token/refresh-token.repository';

const throttleConfig = config.get<any>('throttle.login');
const redisConfig = config.get<any>('queue');
const jwtConfig = config.get<any>('jwt');
const LoginThrottleFactory = {
  provide: 'LOGIN_THROTTLE',
  useFactory: () => {
    const redisClient = new Redis({
      enableOfflineQueue: false,
      host: process.env.REDIS_HOST || redisConfig.host,
      port: process.env.REDIS_PORT || redisConfig.port,
      password: process.env.REDIS_PASSWORD || redisConfig.password
    });

    return new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: throttleConfig.prefix,
      points: throttleConfig.limit,
      duration: 60 * 60 * 24 * 30, // Store number for 30 days since first fail
      blockDuration: throttleConfig.blockDuration
    });
  }
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || jwtConfig.secret,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || jwtConfig.expiresIn
        }
      })
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    TypeOrmModule.forFeature([UserRepository]),
    MailModule,
    RefreshTokenModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTwoFactorStrategy,
    JwtStrategy,
    UniqueValidatorPipe,
    LoginThrottleFactory,
    UserRepository
  ],
  exports: [
    AuthService,
    JwtTwoFactorStrategy,
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}
