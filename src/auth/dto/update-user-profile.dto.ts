import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

/**
 * update user profile transfer object
 */
export class UpdateUserProfileDto extends OmitType(UpdateUserDto, [
  'status',
  'roleId'
] as const) {
  @ApiPropertyOptional()
  @ValidateIf((object, value) => value)
  avatar: string;
}
