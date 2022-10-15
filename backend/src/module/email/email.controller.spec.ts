import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';

describe('EmailToken Controller', () => {
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
