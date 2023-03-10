import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permission/permissions.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UniqueValidatorPipe } from '../common/pipes/unique-validator.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleRepository]),
    AuthModule,
    PermissionsModule
  ],
  exports: [],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository, UniqueValidatorPipe]
})
export class RolesModule {}
