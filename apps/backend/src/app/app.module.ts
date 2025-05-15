import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from '../lib/common/utils/is-dev.util'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { FetchModule } from 'nestjs-fetch'


@Module({
  imports: [
    ConfigModule.forRoot({
      //Игнорировать .env в Production.
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    FetchModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
