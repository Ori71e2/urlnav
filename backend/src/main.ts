import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/common/filters/all-exception.filter';
import { CookieInterceptor } from './shared/common/interceptors/cookie.interceptor';
import { CookieMiddleware } from './shared/common/middlewares/cookie.middleware';
import * as cookieParser from  'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
// 将cookieParser排列在最前面，以便自定义中间件获取cookie值
  app
    .use(cookieParser())
    .use(new CookieMiddleware().use)
    .useGlobalInterceptors(new CookieInterceptor())
    .useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
