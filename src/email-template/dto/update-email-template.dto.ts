import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { CreateEmailTemplateDto } from './create-email-template.dto';

export class UpdateEmailTemplateDto extends PartialType(
  CreateEmailTemplateDto
) {
  @ApiPropertyOptional()
  @Optional()
  @IsString()
  title: string;
}
