import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CatalogService } from './catalog.service';

@Module({
  imports: [PrismaModule],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
