import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { InittranacService } from '../../transaction/inittranac.service';
import * as request from 'supertest';

describe('Auth Controller', () => {

  let app: INestApplication;
  let authService = {
    validateLogin: (email: string, password: string) => { return { token: 'accessToken', user: {}} }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService, UserService, InittranacService]
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(UserService)
      .useValue(authService)
      .overrideProvider(InittranacService)
      .useValue(authService)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });
  it('init app', () => {
    expect(app).toBeDefined();
  });
  it('/POST /auth/email/login', (done) => {
    request(app.getHttpServer())
      .post('/auth/email/login')
      .send({
        email: 'test@email.com',
        password: 'test'
      })
      .expect(HttpStatus.OK)
      .end((err, res) => {
        console.log(res.body)
        done();
      })
  });
  afterAll(async () => {
    await app.close();
  })
});
