import { Factory } from 'typeorm-seeding';
import { DataSource } from 'typeorm';

import * as templates from '../../config/email-template';
import { EmailTemplateEntity } from '../../email-template/entities/email-template.entity';

export default class CreateEmailTemplateSeed {
  public async run(factory: Factory, datasource: DataSource): Promise<any> {
    await datasource
      .createQueryBuilder()
      .insert()
      .into(EmailTemplateEntity)
      .values(templates)
      .orIgnore()
      .execute();
  }
}
