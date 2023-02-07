import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UniqueValidatorPipe } from '../../../../src/common/pipes/unique-validator.pipe';
import { UniqueValidationArguments } from '../../../../src/common/pipes/abstract-unique-validator';
import { UserEntity } from '../../../../src/auth/entity/user.entity';

const mockConnection = () => ({
  getRepository: jest.fn(() => ({
    count: jest.fn().mockResolvedValue(0)
  }))
});

describe('UniqueValidatorPipe', () => {
  let isUnique: UniqueValidatorPipe, datasource;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UniqueValidatorPipe,
        {
          provide: getDataSourceToken(),
          useFactory: mockConnection
        }
      ]
    }).compile();
    isUnique = await module.get<UniqueValidatorPipe>(UniqueValidatorPipe);
    datasource = await module.get<DataSource>(DataSource);
  });

  describe('check unique validation', () => {
    it('check if there is no duplicate', async () => {
      const username = 'tester';
      const args: UniqueValidationArguments<UserEntity> = {
        constraints: [UserEntity, ({ object: {} }) => ({})],
        value: username,
        targetName: '',
        object: {
          username
        },
        property: 'username'
      };
      const result = await isUnique.validate<UserEntity>('username', args);
      expect(datasource.getRepository).toHaveBeenCalledWith(UserEntity);
      expect(result).toBe(true);
    });
  });
});
