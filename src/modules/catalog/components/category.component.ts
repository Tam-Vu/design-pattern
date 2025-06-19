import { CatalogComponent } from '../interfaces/catalog-component.interface';

/**
 * Category class - Composite in the Composite pattern
 * Implements CatalogComponent and can contain other CatalogComponents
 */
export class Category implements CatalogComponent {
  private children: CatalogComponent[] = [];

  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly isDisabled: boolean = false,
  ) {}

  add(component: CatalogComponent): void {
    this.children.push(component);
  }

  remove(componentId: string): void {
    this.children = this.children.filter(
      (component) => component.getId() !== componentId
    );
  }

  getPrice(): number {
    return this.children.reduce(
      (sum, component) => sum + component.getPrice(),
      0
    );
  }

  display(): string {
    let result = `Category: ${this.name}\n`;
    
    if (this.children.length > 0) {
      result += 'Contains:\n';
      this.children.forEach(component => {
        result += `  - ${component.display().replace(/\n/g, '\n  ')}\n`;
      });
    } else {
      result += 'No products in this category.\n';
    }
    
    return result;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getChildren(): CatalogComponent[] {
    return [...this.children];
  }

  isDisable(): boolean {
    return this.isDisabled;
  }

  getProductCount(): number {
    return this.children.length;
  }

  findComponentById(id: string): CatalogComponent | null {
    if (this.id === id) {
      return this;
    }

    for (const child of this.children) {
      if (child.getId() === id) {
        return child;
      }
      if (child instanceof Category) {
        const found = child.findComponentById(id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }
}
