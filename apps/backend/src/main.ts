/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'
import IORedis from 'ioredis'
import session from 'express-session'
import { ms, StringValue } from './lib/common/utils/ms.util'
import { parseBoolean } from './lib/common/utils/parse-boolean.util'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const redisUri = config.getOrThrow<string>('REDIS_URI')
  console.log({ redisUri })
  const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'))

  app.use(cookieParser(config.getOrThrow<string | string[]>('COOKIES_SECRET')))

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))

  app.use(session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: true,
    // Не сохранять неинициализированные сессии (не содержащие userId).
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
      sameSite: 'lax',
    },
    store: new RedisStore({
      client: redis,
      //Путь (префикс) к ключам сессий в Redis.
      prefix: config.getOrThrow<string>('SESSION_FOLDER'),
    }),
  }))

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = config.getOrThrow<number>('APPLICATION_PORT') || 5000
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    `POSTGRES_URI= ${config.getOrThrow<string>('POSTGRES_URI')}`,
  )
}

bootstrap()
