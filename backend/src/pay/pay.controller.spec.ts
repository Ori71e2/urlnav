import { Test, TestingModule } from '@nestjs/testing';
import { PayController } from './pay.controller';

describe('Pay Controller', () => {
  let controller: PayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayController],
    }).compile();

    controller = module.get<PayController>(PayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
