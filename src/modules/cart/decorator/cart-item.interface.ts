export interface CartItem {
  getPrice(): number;
  getDescription(): string;
  getProductId(): string;
  getQuantity(): number;
  hasGiftWrap?(): boolean;
  hasExpressShipping?(): boolean;
}
