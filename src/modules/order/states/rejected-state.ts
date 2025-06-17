import { OrderStatus } from '@prisma/client';
import { OrderModel } from '../models/order.model';
import { OrderState } from './order-state.interface';

export class RejectedState implements OrderState {
  async handle(context: OrderModel): Promise<void> {
    // Final state, nothing to do
  }

  getName(): string {
    return OrderStatus.REJECT;
  }
}
