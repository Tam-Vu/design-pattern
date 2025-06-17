import { CartItem } from './cart-item.interface';

export abstract class CartItemDecorator implements CartItem {
  protected cartItem: CartItem;

  constructor(cartItem: CartItem) {
    this.cartItem = cartItem;
  }

  getPrice(): number {
    return this.cartItem.getPrice();
  }

  getDescription(): string {
    return this.cartItem.getDescription();
  }

  getProductId(): string {
    return this.cartItem.getProductId();
  }

  getQuantity(): number {
    return this.cartItem.getQuantity();
  }
}
