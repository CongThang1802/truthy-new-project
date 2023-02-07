import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateRepository } from './email-template.repository';
import { AuthModule } from '../auth/auth.module';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';
import { UniqueValidatorPipe } from '../common/pipes/unique-validator.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplateRepository]),
    forwardRef(() => AuthModule)
  ],
  exports: [EmailTemplateService],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService, UniqueValidatorPipe]
})
export class EmailTemplateModule {}
