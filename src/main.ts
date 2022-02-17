/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/exceptions';

// import * as session from 'express-session';
// import * as passport from 'passport';
// import * as  redis from 'redis';
// import * as connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const document = SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle('Item API')
    .setDescription('My Item API')
    .build()
  );
  SwaggerModule.setup('docs', app, document);

  // const redisClient = redis.createClient({ url: process.env.REDIS_HOST })
  // const RedisStore = connectRedis(session);
  // redisClient.on('connect', () => console.log('CONNECTED TO REDIS'));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true,
    transform: true,
  }));
  // const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.enableCors();
  // app.use(session({
  //   cookie: {
  //     maxAge: 60000 * 60 * 24 * 90,
  //   },
  //   secret: process.env.SESSION_SECRET,
  //   resave: false,
  //   saveUninitialized: false,
  //   store: new RedisStore({ client: redisClient }),
  // }));

  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
