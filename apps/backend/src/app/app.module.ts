import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from '../lib/common/utils/is-dev.util'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      //Игнорировать .env в Production.
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
