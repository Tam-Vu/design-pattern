import { ProductComponent } from './product-component.interface';

export class SimpleProduct implements ProductComponent {
  constructor(private price: number, private description: string) {}

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return this.description;
  }
}
