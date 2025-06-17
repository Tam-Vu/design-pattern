import { CartItems, Products } from '@prisma/client';
import { CartItem } from './cart-item.interface';

export class ConcreteCartItem implements CartItem {
  private cartItem: CartItems & { product: Products };

  constructor(cartItem: CartItems & { product: Products }) {
    this.cartItem = cartItem;
  }

  getPrice(): number {
    return parseFloat(this.cartItem.product.price.toString()) * this.cartItem.quantity;
  }

  getDescription(): string {
    return this.cartItem.product.title;
  }

  getProductId(): string {
    return this.cartItem.product_id;
  }

  getQuantity(): number {
    return this.cartItem.quantity;
  }
  
  hasGiftWrap(): boolean {
    return Boolean(this.cartItem.gift_wrap);
  }
  
  hasExpressShipping(): boolean {
    return Boolean(this.cartItem.express_shipping);
  }
}
