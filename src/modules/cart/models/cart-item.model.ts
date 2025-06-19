import { Products } from '@prisma/client';

export class CartItem {
  private _id?: number;
  private _product: Products;
  private _quantity: number;
  private _cartId: number;

  constructor() {
    this._quantity = 0;
  }

  get id(): number | undefined {
    return this._id;
  }

  set id(value: number | undefined) {
    this._id = value;
  }

  get product(): Products {
    return this._product;
  }

  set product(value: Products) {
    this._product = value;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
  }

  get cartId(): number {
    return this._cartId;
  }

  set cartId(value: number) {
    this._cartId = value;
  }

  addProductQuantity(amount: number = 1): void {
    this._quantity += amount;
  }

  removeProductQuantity(amount: number = 1): void {
    if (this._quantity - amount >= 0) {
      this._quantity -= amount;
    } else {
      this._quantity = 0;
    }
  }
}

export class CartItemBuilder {
  private cartItem: CartItem;

  constructor() {
    this.cartItem = new CartItem();
  }

  withId(id: number): CartItemBuilder {
    this.cartItem.id = id;
    return this;
  }

  withProduct(product: Products): CartItemBuilder {
    this.cartItem.product = product;
    return this;
  }

  withQuantity(quantity: number): CartItemBuilder {
    this.cartItem.quantity = quantity;
    return this;
  }

  withCartId(cartId: number): CartItemBuilder {
    this.cartItem.cartId = cartId;
    return this;
  }

  build(): CartItem {
    return this.cartItem;
  }
}
