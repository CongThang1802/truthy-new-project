import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import * as path from 'path';
import * as config from 'config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  CookieResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver
} from 'nestjs-i18n';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './config/winston';
import { DataSource } from 'typeorm';
import throttleConfig = require('./config/throttle-config');
import { ormConfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './role/roles.module';
import { PermissionsModule } from './permission/permissions.module';
import { MailModule } from './mail/mail.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';
import { CustomThrottlerGuard } from './common/guard/custom-throttle.guard';
import { I18nExceptionFilterPipe } from './common/pipes/i18n-exception-filter.pipe';
import { AppController } from './app.controller';
import { TwofaModule } from './twofa/twofa.module';

const appConfig = config.get<any>('app');

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRootAsync({
      useFactory: () => throttleConfig
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ormConfig,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      }
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: appConfig.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true
        }
      }),
      loader: I18nJsonLoader,
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang', 'locale', 'l']
        },
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang', 'locale', 'l'])
      ]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*']
    }),
    AuthModule,
    RolesModule,
    PermissionsModule,
    MailModule,
    EmailTemplateModule,
    RefreshTokenModule,
    // TwofaModule,
    DashboardModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: I18nExceptionFilterPipe
    }
  ],
  controllers: [AppController]
})
export class AppModule {}
