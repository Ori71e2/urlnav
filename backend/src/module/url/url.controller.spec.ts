import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ExecutionContext } from '@nestjs/common';
import { UrlController } from './controller/url.controller';
import { UrlService } from './url.service';
import { Url } from 'src/shared/entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/shared/common/guards/jwtauth.guard';
describe('Url Controller', () => {
  let app: INestApplication;
  let urlService = {
    getOneByUserId: (id: number) => { return { list: 'list2', tag: 'tag2', updatetime:'2', userId: 2} },
    updateTagByUserId: (id: number, tag: 'tag1') => { return { list: 'list2', tag: 'tag2', updatetime:'2', userId: 2} },
    updateListByUserId: (id: number, list: 'list1') => { return { list: 'list2', tag: 'tag2', updatetime:'2', userId: 2} },
  };
  let user2 = { list: 'list2', tag: 'tag2', updatetime:'2', userId: 2};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UrlController],
      providers: [UrlService]
    })
      .overrideProvider(UrlService)
      .useValue(urlService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user2;
          return true;
        }
      })
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('/GET /url/listAndtag', (done) => {
    request(app.getHttpServer())
      .get('/url/listAndtag')
      .auth('xx', { type: 'bearer' })
      .expect(HttpStatus.OK)
      .end((err, res) => {
        console.log(res.body)
        done();
      })
  });

  // it('/POST /url/tag/update', (done) => {
  //   request(app.getHttpServer())
  //     .post('/url/tag/update')
  //     .auth('xx', { type: 'bearer' })
  //     .send({
  //       id: 2,
  //       tag: 'tag1'
  //     })
  //     .expect(HttpStatus.OK)
  //     .end((err, res) => {
  //       console.log(res.body)
  //       done();
  //     })
  // });

  // it('/POST /url/list/update', (done) => {
  //   request(app.getHttpServer())
  //     .post('/url/tag/update')
  //     .send({
  //       id: 2,
  //       list: 'list1'
  //     })
  //     .expect(HttpStatus.OK)
  //     .end((err, res) => {
  //       console.log(res.body)
  //       done();
  //     })
  // });

  afterAll(async () => {
    await app.close();
  })
});
