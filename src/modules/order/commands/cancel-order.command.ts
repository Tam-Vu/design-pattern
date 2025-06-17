import { Injectable } from '@nestjs/common';
import { Command } from './command.interface';
import { OrderReceiver } from './order.receiver';
import { TUserSession } from 'src/common/decorators/user-session.decorator';

@Injectable()
export class CancelOrderCommand implements Command {
  constructor(
    private readonly receiver: OrderReceiver,
    private orderId: string,
    private session: TUserSession,
  ) {}

  async execute() {
    return this.receiver.cancel(this.orderId, this.session.id);
  }
}
