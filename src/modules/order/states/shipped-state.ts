import { OrderStatus } from '@prisma/client';
import { OrderModel } from '../models/order.model';
import { OrderState } from './order-state.interface';
import { DeliveredState } from './delivered-state';

export class ShippedState implements OrderState {
  async handle(context: OrderModel): Promise<void> {
    // Mark the order as delivered
    await context.updateStatus(OrderStatus.SUCCESS);
    context.setState(new DeliveredState());
  }

  getName(): string {
    return OrderStatus.DELIVERED;
  }
}
