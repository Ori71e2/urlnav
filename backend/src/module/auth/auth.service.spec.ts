import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, EmailToken } from 'src/shared/entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from './auth.module';
import { AppModule } from '../../app.module';
import { JWTService } from './jwt.service';

describe('AuthService', () => {

  let service: AuthService;
  let userRepo: Repository<User>;
  let emailRepo: Repository<EmailToken>;
  let authService = {}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    // imports: [AuthModule],
    // imports: [AppModule],
    providers: [
      AuthService,
      JWTService,
      {
        provide: getRepositoryToken(User),
        useValue: authService
      },
      {
        provide: getRepositoryToken(EmailToken),
        useValue: authService
      },
    ]
  })
    .compile();
  service = module.get<AuthService>(AuthService);
  // repo = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('init service', () => {
    expect(service).toBeDefined();
  });
})