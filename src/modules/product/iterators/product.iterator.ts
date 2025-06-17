import { Products } from '@prisma/client';
import { Iterator } from '../../../common/interfaces/iterator.interface';

export class ProductIterator implements Iterator<Products> {
  private position = 0;
  
  constructor(private products: Products[]) {}
  
  hasNext(): boolean {
    return this.position < this.products.length;
  }
  
  next(): Products {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }
    return this.products[this.position++];
  }
  
  reset(): void {
    this.position = 0;
  }
}
