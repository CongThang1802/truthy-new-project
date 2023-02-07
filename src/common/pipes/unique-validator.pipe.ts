import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { DataSource } from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { AbstractUniqueValidator } from './abstract-unique-validator';

/**
 * unique validator pipe
 */
@ValidatorConstraint({
  name: 'unique',
  async: true
})
@Injectable()
export class UniqueValidatorPipe extends AbstractUniqueValidator {
  constructor(
    @InjectDataSource()
    protected readonly datasource: DataSource
  ) {
    super(datasource);
  }
}
