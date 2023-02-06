import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { DataSource } from 'typeorm';

import { AbstractUniqueValidator } from 'src/common/pipes/abstract-unique-validator';
import { InjectDataSource } from '@nestjs/typeorm/dist/common/typeorm.decorators';

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
