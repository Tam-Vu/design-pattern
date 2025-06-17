import { ProductComponent } from './product-component.interface';

export class CompositeProduct implements ProductComponent {
  private children: ProductComponent[] = [];

  add(child: ProductComponent): void {
    this.children.push(child);
  }

  remove(child: ProductComponent): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getPrice(): number {
    return this.children.reduce((total, child) => total + child.getPrice(), 0);
  }

  getDescription(): string {
    return this.children.map(child => child.getDescription()).join(', ');
  }
}
