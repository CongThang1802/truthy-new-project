import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([RefreshTokenRepository])
  ],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
  controllers: []
})
export class RefreshTokenModule {}
