import { CatalogComponent } from '../interfaces/catalog-component.interface';

/**
 * Product class - Leaf in the Composite pattern
 * Implements CatalogComponent for individual products
 */
export class Product implements CatalogComponent {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description: string,
    private readonly price: number,
    private readonly imageUrls: string[],
    private readonly categoryId: string,
    private readonly status: string,
  ) {}

  getPrice(): number {
    return this.price;
  }

  display(): string {
    return `Product: ${this.name}, Price: ${this.price}, Description: ${this.description}`;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getImageUrls(): string[] {
    return this.imageUrls;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getStatus(): string {
    return this.status;
  }
}
