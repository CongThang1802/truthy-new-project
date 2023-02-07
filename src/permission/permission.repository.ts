import { DataSource, EntityRepository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { PermissionEntity } from './entities/permission.entity';
import { BaseRepository } from '../common/repository/base.repository';
import { Permission } from './serializer/permission.serializer';
import { RoutePayloadInterface } from '../config/permission-config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository extends BaseRepository<
  PermissionEntity,
  Permission
> {
  constructor(dataSource: DataSource) {
    super(PermissionEntity, dataSource);
  }
  async syncPermission(
    permissionsList: RoutePayloadInterface[]
  ): Promise<void> {
    await this.createQueryBuilder('permission')
      .insert()
      .into(PermissionEntity)
      .values(permissionsList)
      .orIgnore()
      .execute();
  }

  transform(model: PermissionEntity, transformOption = {}): Permission {
    return plainToClass(
      Permission,
      classToPlain(model, transformOption),
      transformOption
    );
  }

  transformMany(
    models: PermissionEntity[],
    transformOption = {}
  ): Permission[] {
    return models.map((model) => this.transform(model, transformOption));
  }
}
