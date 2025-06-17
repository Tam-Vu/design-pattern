import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { CategoriesModule } from '../category/category.module';
import { SimpleProduct } from './models/simple-product';
import { CompositeProduct } from './models/composite-product';

@Module({
  imports: [PrismaModule, CategoriesModule],
  providers: [ProductsService, SimpleProduct, CompositeProduct],
  controllers: [ProductsController],
  exports: [ProductsService, SimpleProduct, CompositeProduct],
})
export class ProductsModule {}
