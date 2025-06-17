import { CartItemDecorator } from './cart-item-decorator';
import { CartItem } from './cart-item.interface';

export class ExpressShippingDecorator extends CartItemDecorator {
  private readonly EXPRESS_SHIPPING_PRICE = 30000; // Fixed price per item

  constructor(cartItem: CartItem) {
    super(cartItem);
  }

  getPrice(): number {
    return super.getPrice() + (this.EXPRESS_SHIPPING_PRICE * this.getQuantity());
  }

  getDescription(): string {
    return `${super.getDescription()} + Express Shipping`;
  }
}
