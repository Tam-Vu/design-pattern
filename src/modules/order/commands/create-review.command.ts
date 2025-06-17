import { Injectable } from '@nestjs/common';
import { Command } from './command.interface';
import { OrderReceiver } from './order.receiver';
import { TUserSession } from 'src/common/decorators/user-session.decorator';
import { CreateReviewDto } from '../dto/create_review.dto';

@Injectable()
export class CreateReviewCommand implements Command {
  constructor(
    private readonly receiver: OrderReceiver,
    private session: TUserSession,
    private dto: CreateReviewDto,
    private id: string,
    private orderDetailId: string,
    private productId: string,
  ) {}

  async execute() {
    return this.receiver.review(
      this.session,
      this.dto,
      this.id,
      this.orderDetailId,
      this.productId,
    );
  }
}
