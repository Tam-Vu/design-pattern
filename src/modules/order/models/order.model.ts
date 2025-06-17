import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { OrderState } from '../states/order-state.interface';
import { PendingState } from '../states/pending-state';
import { ShippedState } from '../states/shipped-state';
import { DeliveredState } from '../states/delivered-state';
import { CancelledState } from '../states/cancelled-state';
import { RejectedState } from '../states/rejected-state';

export class OrderModel {
  private state: OrderState;
  private id: string;
  private prismaService: PrismaService;

  constructor(id: string, currentStatus: OrderStatus, prismaService: PrismaService) {
    this.id = id;
    this.prismaService = prismaService;
    
    // Set initial state based on current status
    switch (currentStatus) {
      case OrderStatus.PROCESSING:
        this.state = new PendingState();
        break;
      case OrderStatus.DELIVERED:
        this.state = new ShippedState();
        break;
      case OrderStatus.SUCCESS:
        this.state = new DeliveredState();
        break;
      case OrderStatus.CANCELLED:
        this.state = new CancelledState();
        break;
      case OrderStatus.REJECT:
        this.state = new RejectedState();
        break;
      default:
        this.state = new PendingState();
    }
  }

  setState(state: OrderState): void {
    this.state = state;
  }

  async proceed(): Promise<void> {
    await this.state.handle(this);
  }

  async updateStatus(status: OrderStatus): Promise<void> {
    await this.prismaService.orders.update({
      where: { id: this.id },
      data: { status }
    });
  }

  getState(): OrderState {
    return this.state;
  }

  getId(): string {
    return this.id;
  }
}
