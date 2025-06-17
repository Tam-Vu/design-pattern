import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { UserFactory } from './factories/user.factory';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UserFactory],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
