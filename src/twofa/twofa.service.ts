import { HttpStatus, Injectable } from '@nestjs/common';
import * as config from 'config';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream, toDataURL } from 'qrcode';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entity/user.entity';
import { CustomHttpException } from '../exception/custom-http.exception';
import { StatusCodesList } from '../common/constants/status-codes-list.constants';

const TwofaConfig = config.get<any>('twofa');

@Injectable()
export class TwofaService {
  constructor(private readonly usersService: AuthService) {}

  async generateTwoFASecret(user: UserEntity) {
    if (user.twoFAThrottleTime > new Date()) {
      throw new CustomHttpException(
        `tooManyRequest-{"second":"${this.differentBetweenDatesInSec(
          user.twoFAThrottleTime,
          new Date()
        )}"}`,
        HttpStatus.TOO_MANY_REQUESTS,
        StatusCodesList.TooManyTries
      );
    }
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      TwofaConfig.authenticationAppNAme,
      secret
    );
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl
    };
  }

  isTwoFACodeValid(twoFASecret: string, user: UserEntity) {
    return authenticator.verify({
      token: twoFASecret,
      secret: user.twoFASecret
    });
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async qrDataToUrl(otpauthUrl: string): Promise<string> {
    return toDataURL(otpauthUrl);
  }

  differentBetweenDatesInSec(initialDate: Date, endDate: Date): number {
    const diffInSeconds = Math.abs(initialDate.getTime() - endDate.getTime());
    return Math.round(diffInSeconds / 1000);
  }
}
