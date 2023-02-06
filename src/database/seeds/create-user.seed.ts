import { Factory } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../auth/entity/user.entity';
import { RoleEntity } from '../../role/entities/role.entity';
import { UserStatusEnum } from '../../auth/user-status.enum';

export default class CreateUserSeed {
  public async run(factory: Factory, datasource: DataSource): Promise<any> {
    const role = await datasource
      .getRepository(RoleEntity)
      .createQueryBuilder('role')
      .where('role.name = :name', {
        name: 'superuser'
      })
      .getOne();

    if (!role) {
      return;
    }
    await datasource
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          username: 'admin',
          email: 'admin@truthy.com',
          password:
            '$2b$10$O9BWip02GuE14bDPfBomQebCjwKQyuUfkulhvBB1UoizOeKxGG8Fu', // Truthy@123
          salt: '$2b$10$O9BWip02GuE14bDPfBomQe',
          name: 'truthy',
          status: UserStatusEnum.ACTIVE,
          roleId: role.id
        }
      ])
      .orIgnore()
      .execute();
  }
}
