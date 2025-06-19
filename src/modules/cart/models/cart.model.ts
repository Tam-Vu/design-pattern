import { CartItem } from './cart-item.model';

export class Cart {
  private _id: number;
  private _userId: string;
  private _cartItems: CartItem[] = [];

  constructor(id: number, userId: string) {
    this._id = id;
    this._userId = userId;
  }

  get id(): number {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get cartItems(): CartItem[] {
    return this._cartItems;
  }

  addCartItem(cartItem: CartItem): void {
    const existingItem = this._cartItems.find(
      (item) => item.product.id === cartItem.product.id,
    );

    if (existingItem) {
      existingItem.addProductQuantity(cartItem.quantity);
    } else {
      this._cartItems.push(cartItem);
    }
  }

  removeCartItem(productId: string): void {
    this._cartItems = this._cartItems.filter(
      (item) => item.product.id !== productId,
    );
  }

  updateCartItem(productId: string, quantity: number): void {
    const item = this._cartItems.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  clearCartItems(): void {
    this._cartItems = [];
  }

  getTotal(): number {
    return this._cartItems.reduce(
      (total, item) =>
        total + Number(item.product.final_price || item.product.price) * item.quantity,
      0,
    );
  }
}
