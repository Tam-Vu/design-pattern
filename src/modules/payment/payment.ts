import { Injectable } from "@nestjs/common";
import { PaymentStrategy } from "./strategies/payment-strategy.interface";
import { CreatePaymentUrlDto } from "../order/dto/create_order_payment_url.dto";
import { Orders } from "@prisma/client";

@Injectable()
export class Payment {
  private paymentStrategy: PaymentStrategy;

  setPayment(paymentStrategy: PaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  async paymentExecute(dto: CreatePaymentUrlDto, order: Orders): Promise<any> {
    if (!this.paymentStrategy) {
      throw new Error("Payment strategy not set");
    }
    return this.paymentStrategy.pay(dto, order);
  }
}
