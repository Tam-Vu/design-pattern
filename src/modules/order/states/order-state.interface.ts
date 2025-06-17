import { OrderModel } from '../models/order.model';

export interface OrderState {
  handle(context: OrderModel): Promise<void>;
  getName(): string;
}
