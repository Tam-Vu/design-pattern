import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogComponent } from './interfaces/catalog-component.interface';
import { Category } from './components/category.component';
import { Product } from './components/product.component';

@Injectable()
export class CatalogService {
  private catalogRoot: Category;

  constructor(private readonly prisma: PrismaService) {
    this.catalogRoot = new Category('root', 'Catalog Root');
    this.initializeCatalog();
  }

  private async initializeCatalog(): Promise<void> {
    try {
      const categories = await this.prisma.category.findMany({
        where: {
          is_disable: false,
        },
      });

      const categoryComponents = new Map<string, Category>();
      
      categories.forEach(category => {
        const categoryComponent = new Category(
          category.id,
          category.name,
          category.is_disable
        );
        categoryComponents.set(category.id, categoryComponent);
        this.catalogRoot.add(categoryComponent);
      });

      const products = await this.prisma.products.findMany({
        where: {
          status: 'ACTIVE',
          Category: {
            is_disable: false,
          },
        },
      });

      products.forEach(product => {
        const categoryComponent = categoryComponents.get(product.category_id);
        if (categoryComponent) {
          const productComponent = new Product(
            product.id,
            product.title,
            product.description,
            Number(product.price),
            product.image_url,
            product.category_id,
            product.status
          );
          categoryComponent.add(productComponent);
        }
      });
    } catch (error) {
      console.error('Failed to initialize catalog:', error);
    }
  }

  async refreshCatalog(): Promise<void> {
    this.catalogRoot = new Category('root', 'Catalog Root');
    await this.initializeCatalog();
  }

  getCatalog(): Category {
    return this.catalogRoot;
  }

  getCategoryById(id: string): Category | null {
    const component = this.catalogRoot.findComponentById(id);
    return component instanceof Category ? component : null;
  }

  getProductById(id: string): Product | null {
    const component = this.catalogRoot.findComponentById(id);
    return component instanceof Product ? component : null;
  }

  getTotalCatalogPrice(): number {
    return this.catalogRoot.getPrice();
  }

  getCategoryProducts(categoryId: string): Product[] {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return [];
    }

    return category.getChildren().filter(
      component => component instanceof Product
    ) as Product[];
  }

  searchProducts(query: string): Product[] {
    const results: Product[] = [];
    const searchInCategory = (category: Category) => {
      category.getChildren().forEach(component => {
        if (component instanceof Product) {
          if (
            component.getName().toLowerCase().includes(query.toLowerCase()) ||
            component.getDescription().toLowerCase().includes(query.toLowerCase())
          ) {
            results.push(component);
          }
        } else if (component instanceof Category) {
          searchInCategory(component); 
        }
      });
    };

    searchInCategory(this.catalogRoot);
    return results;
  }
}
