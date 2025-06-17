import { CartItemDecorator } from './cart-item-decorator';
import { CartItem } from './cart-item.interface';

export class GiftWrapDecorator extends CartItemDecorator {
  private readonly GIFT_WRAP_PRICE = 10000; // Price per item

  constructor(cartItem: CartItem) {
    super(cartItem);
  }

  getPrice(): number {
    return super.getPrice() + (this.GIFT_WRAP_PRICE * this.getQuantity());
  }

  getDescription(): string {
    return `${super.getDescription()} + Gift Wrap`;
  }
}
