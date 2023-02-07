import { DataSource, EntityRepository } from 'typeorm';
import * as config from 'config';
import { RefreshToken } from './entities/refresh-token.entity';
import { BaseRepository } from '../common/repository/base.repository';
import { RefreshTokenSerializer } from './serializer/refresh-token.serializer';
import { UserSerializer } from '../auth/serializer/user.serializer';
import { Injectable } from '@nestjs/common';

const tokenConfig = config.get<any>('jwt');
@Injectable()
export class RefreshTokenRepository extends BaseRepository<
  RefreshToken,
  RefreshTokenSerializer
> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource);
  }
  /**
   * Create refresh token
   * @param user
   * @param tokenPayload
   */
  public async createRefreshToken(
    user: UserSerializer,
    tokenPayload: Partial<RefreshToken>
  ): Promise<RefreshToken> {
    const token = this.create();
    token.userId = user.id;
    token.isRevoked = false;
    token.ip = tokenPayload.ip;
    token.userAgent = tokenPayload.userAgent;
    token.browser = tokenPayload.browser;
    token.os = tokenPayload.os;
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + tokenConfig.refreshExpiresIn
    );
    token.expires = expiration;
    return token.save();
  }

  /**
   * find token by id
   * @param id
   */
  public async findTokenById(id: number): Promise<RefreshToken | null> {
    return this.findOne({
      where: {
        id
      }
    });
  }
}
