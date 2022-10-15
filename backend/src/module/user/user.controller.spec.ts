import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { INestApplication, HttpStatus } from '@nestjs/common';

describe('User Controller', () => {
  let app: INestApplication;
  let userService = {
    register: (accout: string, password: string) => { return true }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService]
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });
  it('init app', () => {
    expect(app).toBeDefined();
  });
  // it('/POST /user/register', (done) => {
  //   request(app.getHttpServer())
  //     .post('/user/register')
  //     .send({
  //       accout: 'test@email.com',
  //       password: 'test'
  //     })
  //     .expect(HttpStatus.CREATED)
  //     .end((err, res) => {
  //       // expect(res.body.code).toEqual(HttpStatus.CREATED);
  //       console.log(res.body)
  //       done();
  //     })
  // });
  afterAll(async () => {
    await app.close();
  })
});
