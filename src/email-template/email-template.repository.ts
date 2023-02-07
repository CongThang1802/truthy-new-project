import { EntityRepository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { BaseRepository } from '../common/repository/base.repository';
import { EmailTemplate } from './serializer/email-template.serializer';

@EntityRepository(EmailTemplateEntity)
export class EmailTemplateRepository extends BaseRepository<
  EmailTemplateEntity,
  EmailTemplate
> {
  transform(model: EmailTemplateEntity, transformOption = {}): EmailTemplate {
    return plainToClass(
      EmailTemplate,
      classToPlain(model, transformOption),
      transformOption
    );
  }

  transformMany(
    models: EmailTemplateEntity[],
    transformOption = {}
  ): EmailTemplate[] {
    return models.map((model) => this.transform(model, transformOption));
  }
}
