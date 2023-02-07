import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from '../auth/auth.module';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  imports: [AuthModule],
  providers: [DashboardService]
})
export class DashboardModule {}
