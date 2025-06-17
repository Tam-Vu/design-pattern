import { CartItems } from '@prisma/client';
import { Iterator } from '../../../common/interfaces/iterator.interface';

export class CartItemIterator implements Iterator<CartItems> {
  private position = 0;
  
  constructor(private cartItems: CartItems[]) {}
  
  hasNext(): boolean {
    return this.position < this.cartItems.length;
  }
  
  next(): CartItems {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }
    return this.cartItems[this.position++];
  }
  
  reset(): void {
    this.position = 0;
  }
}
