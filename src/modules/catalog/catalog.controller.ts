import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { Category } from './components/category.component';
import { Product } from './components/product.component';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getCatalog() {
    return {
      data: this.catalogService.getCatalog(),
      totalPrice: this.catalogService.getTotalCatalogPrice()
    };
  }

  @Get('category/:id')
  getCategoryById(@Param('id') id: string) {
    const category = this.catalogService.getCategoryById(id);
    if (!category) {
      return { message: 'Category not found', data: null };
    }
    return {
      data: category,
      productCount: category.getProductCount(),
      totalPrice: category.getPrice()
    };
  }

  @Get('product/:id')
  getProductById(@Param('id') id: string) {
    const product = this.catalogService.getProductById(id);
    if (!product) {
      return { message: 'Product not found', data: null };
    }
    return { data: product };
  }

  @Get('search')
  searchProducts(@Query('query') query: string) {
    if (!query || query.trim() === '') {
      return { message: 'Query parameter is required', data: [] };
    }
    const products = this.catalogService.searchProducts(query);
    return {
      data: products,
      count: products.length
    };
  }

  @Get('category/:id/products')
  getCategoryProducts(@Param('id') id: string) {
    const products = this.catalogService.getCategoryProducts(id);
    return {
      data: products,
      count: products.length,
      totalPrice: products.reduce((sum, product) => sum + product.getPrice(), 0)
    };
  }

  @Post('refresh')
  async refreshCatalog() {
    await this.catalogService.refreshCatalog();
    return { message: 'Catalog refreshed successfully' };
  }
}
