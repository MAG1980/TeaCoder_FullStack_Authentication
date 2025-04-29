/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)

  app.use(cookieParser(config.getOrThrow<string | string[]>('COOKIES_SECRET')))

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
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
    `POSTGRES_URI= ${config.getOrThrow<string>("POSTGRES_URI")}`
  )
}

bootstrap()
