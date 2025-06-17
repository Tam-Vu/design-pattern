import { Injectable } from '@nestjs/common';
import { Command } from './command.interface';
import { OrderReceiver } from './order.receiver';
import { UpdateOrderStatusDto } from '../dto/update_order_status.dto';

@Injectable()
export class UpdateOrderStatusCommand implements Command {
  constructor(
    private readonly receiver: OrderReceiver,
    private id: string,
    private dto: UpdateOrderStatusDto,
  ) {}

  async execute() {
    return this.receiver.updateStatus(this.id, this.dto);
  }
}
