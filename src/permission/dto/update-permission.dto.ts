import { Optional } from '@nestjs/common';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiPropertyOptional()
  @Optional()
  @IsString()
  description: string;
}
