import { DeepPartial, EntityRepository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { classToPlain, plainToClass } from 'class-transformer';
import { UserEntity } from './entity/user.entity';
import { BaseRepository } from '../common/repository/base.repository';
import { UserSerializer } from './serializer/user.serializer';
import { UserStatusEnum } from './user-status.enum';
import { UserLoginDto } from './dto/user-login.dto';
import { ExceptionTitleList } from '../common/constants/exception-title-list.constants';
import { StatusCodesList } from '../common/constants/status-codes-list.constants';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity, UserSerializer> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource);
  }
  /**
   * store new user
   * @param createUserDto
   * @param token
   */
  async store(
    createUserDto: DeepPartial<UserEntity>,
    token: string
  ): Promise<UserSerializer> {
    if (!createUserDto.status) {
      createUserDto.status = UserStatusEnum.INACTIVE;
    }
    createUserDto.salt = await bcrypt.genSalt();
    createUserDto.token = token;
    const user = this.create(createUserDto);
    await user.save();
    return this.transform(user);
  }

  /**
   * login user
   * @param userLoginDto
   */
  async login(
    userLoginDto: UserLoginDto
  ): Promise<[user: UserEntity, error: string, code: number]> {
    const { username, password } = userLoginDto;
    const user = await this.findOne({
      where: [
        {
          username: username
        },
        {
          email: username
        }
      ]
    });
    if (user && (await user.validatePassword(password))) {
      if (user.status !== UserStatusEnum.ACTIVE) {
        return [
          null,
          ExceptionTitleList.UserInactive,
          StatusCodesList.UserInactive
        ];
      }
      return [user, null, null];
    }
    return [
      null,
      ExceptionTitleList.InvalidCredentials,
      StatusCodesList.InvalidCredentials
    ];
  }

  /**
   * Get user entity for reset password
   * @param resetPasswordDto
   */
  async getUserForResetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<UserEntity> {
    const { token } = resetPasswordDto;
    const query = this.createQueryBuilder('user');
    query.where('user.token = :token', { token });
    query.andWhere('user.tokenValidityDate > :date', {
      date: new Date()
    });
    return query.getOne();
  }

  /**
   * transform user
   * @param model
   * @param transformOption
   */
  transform(model: UserEntity, transformOption = {}): UserSerializer {
    return plainToClass(
      UserSerializer,
      classToPlain(model, transformOption),
      transformOption
    );
  }

  /**
   * transform users collection
   * @param models
   * @param transformOption
   */
  transformMany(models: UserEntity[], transformOption = {}): UserSerializer[] {
    return models.map((model) => this.transform(model, transformOption));
  }
}
