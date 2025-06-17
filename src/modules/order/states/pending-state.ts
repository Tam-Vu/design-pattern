import { OrderStatus } from '@prisma/client';
import { OrderModel } from '../models/order.model';
import { OrderState } from './order-state.interface';
import { ShippedState } from './shipped-state';

export class PendingState implements OrderState {
  async handle(context: OrderModel): Promise<void> {
    // Process the order and move to shipped state
    await context.updateStatus(OrderStatus.DELIVERED);
    context.setState(new ShippedState());
  }

  getName(): string {
    return OrderStatus.PROCESSING;
  }
}
