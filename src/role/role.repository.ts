import { DataSource, EntityRepository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { RoleEntity } from './entities/role.entity';
import { BaseRepository } from '../common/repository/base.repository';
import { RoleSerializer } from './serializer/role.serializer';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionEntity } from '../permission/entities/permission.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity, RoleSerializer> {
  constructor(dataSource: DataSource) {
    super(RoleEntity, dataSource);
  }
  async store(
    createRoleDto: CreateRoleDto,
    permissions: PermissionEntity[]
  ): Promise<RoleSerializer> {
    const { name, description } = createRoleDto;
    const role = this.create();
    role.name = name;
    role.description = description;
    role.permission = permissions;
    await role.save();
    return this.transform(role);
  }

  async updateItem(
    role: RoleEntity,
    updateRoleDto: UpdateRoleDto,
    permission: PermissionEntity[]
  ): Promise<RoleSerializer> {
    const fields = ['name', 'description'];
    for (const field of fields) {
      if (updateRoleDto[field]) {
        role[field] = updateRoleDto[field];
      }
    }
    if (permission && permission.length > 0) {
      role.permission = permission;
    }
    await role.save();
    return this.transform(role);
  }

  /**
   * transform single role
   * @param model
   * @param transformOption
   */
  transform(model: RoleEntity, transformOption = {}): RoleSerializer {
    return plainToClass(
      RoleSerializer,
      classToPlain(model, transformOption),
      transformOption
    );
  }

  /**
   * transform array of roles
   * @param models
   * @param transformOption
   */
  transformMany(models: RoleEntity[], transformOption = {}): RoleSerializer[] {
    return models.map((model) => this.transform(model, transformOption));
  }
}
