import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersStatsInterface } from './interface/user-stats.interface';
import { UserStatusEnum } from '../auth/user-status.enum';
import { OsStatsInterface } from './interface/os-stats.interface';
import { BrowserStatsInterface } from './interface/browser-stats.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly authService: AuthService) {}

  async getUserStat(): Promise<UsersStatsInterface> {
    const totalUserPromise = this.authService.countByCondition({});
    const totalActiveUserPromise = this.authService.countByCondition({
      status: UserStatusEnum.ACTIVE
    });
    const totalInActiveUserPromise = this.authService.countByCondition({
      status: UserStatusEnum.INACTIVE
    });
    const [total, active, inactive] = await Promise.all([
      totalUserPromise,
      totalActiveUserPromise,
      totalInActiveUserPromise
    ]);
    return {
      total,
      active,
      inactive
    };
  }

  getOsData(): Promise<Array<OsStatsInterface>> {
    return this.authService.getRefreshTokenGroupedData('os');
  }

  getBrowserData(): Promise<Array<BrowserStatsInterface>> {
    return this.authService.getRefreshTokenGroupedData('browser');
  }
}
