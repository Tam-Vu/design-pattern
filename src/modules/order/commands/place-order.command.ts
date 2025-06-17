import { Injectable } from '@nestjs/common';
import { Command } from './command.interface';
import { OrderReceiver } from './order.receiver';
import { TUserSession } from 'src/common/decorators/user-session.decorator';
import { CreateOrderDto } from '../dto/create_order.dto';

@Injectable()
export class PlaceOrderCommand implements Command {
  constructor(
    private readonly receiver: OrderReceiver,
    private session: TUserSession,
    private dto: CreateOrderDto,
  ) {}

  async execute() {
    return this.receiver.place(this.session, this.dto);
  }
}
