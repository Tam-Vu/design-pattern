import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import Modules from './modules';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
      load: [configuration],
    }),
    PrismaModule,
    ...Modules,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
