import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
// import { UrlDto } from './url.dto';
import { User } from 'src/shared/entity';
import { Repository, getRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { testAppModule } from '../entity';

const urlArray = [
  { list: 'list2', tag: 'tag2', updatetime:'2', userId: 2},
  { list: 'list3', tag: 'tag3', updatetime:'3', userId: 3},
  { list: 'list4', tag: 'tag4', updatetime:'4', userId: 4},
];

const testUserId1 = 1;
const oneUrl = { list: 'list1', tag: 'tag1', updatetime: '1',  userId: testUserId1};

describe('User Service', () => {
  let service: UserService;
  let repo: Repository<User>;
  let urlService = {
    create: jest.fn().mockReturnValue(oneUrl),
    find: jest.fn().mockResolvedValue(urlArray),
    findOneOrFail: jest.fn().mockResolvedValue(oneUrl),
    save: jest.fn().mockResolvedValue(oneUrl),
    insert: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    createQueryBuilder: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(true)
    }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [testAppModule],
      // imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: urlService
        }
      ]
    })
      .compile();
    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('init service', () => {
    expect(service).toBeDefined();
  });
  // describe('get one list', () => {
  //   it('get one list', async (done) => {
  //     const repoSpy = jest.spyOn(repo, 'findOneOrFail');
  //     expect(service.getOneByUserId(0)).resolves.toEqual(oneUrl);
  //     expect(repoSpy).toBeCalledWith({ userId: 0 });
  //     done();
  //   });
  // })

  // describe('insert one list', () => {
  //   it('insert one list', async (done) => {
  //     expect(
  //       service.insertOne({
  //         list: 'list1', 
  //         tag: 'tag1',
  //         updatetime: '1', 
  //         userId: testUserId1
  //       })
  //     ).resolves.toEqual(true);
  //     expect(repo.insert).toBeCalledTimes(1);
  //     done();
  //   });
  // })

  // describe('update tag and list by user id', () => {
  //   it('update tag and list', async (done) => {
  //     expect(
  //       service.updateByUserId({
  //         list: 'list1',
  //         tag: 'tag1',
  //         userId: testUserId1
  //       })
  //     ).resolves.toEqual(true);
  //     expect(repo.update).toBeCalledTimes(1);
  //     done();
  //   });
  // })

  // describe('update tag by user id', () => {
  //   it('update tag', async (done) => {
  //     expect(
  //       service.updateTagByUserId({
  //         tag: 'tag1',
  //         userId: testUserId1
  //       })
  //     ).resolves.toEqual(true);
  //     expect(repo.save).toBeCalledTimes(1);
  //     done();
  //   });
  // })

  // describe('update list by user id', () => {
  //   it('update list', async (done) => {
  //     expect(
  //       service.updateListByUserId({
  //         list: 'list1',
  //         userId: testUserId1
  //       })
  //     ).resolves.toEqual(true);
  //     expect(repo.save).toBeCalledTimes(2);
  //     done();
  //   });
  // })

})
