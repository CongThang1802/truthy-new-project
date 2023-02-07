import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from './permission.repository';
import { AuthModule } from '../auth/auth.module';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { UniqueValidatorPipe } from '../common/pipes/unique-validator.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository]), AuthModule],
  exports: [PermissionsService],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionRepository, UniqueValidatorPipe]
})
export class PermissionsModule {}
