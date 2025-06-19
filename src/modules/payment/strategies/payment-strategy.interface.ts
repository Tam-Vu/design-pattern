import { CreatePaymentUrlDto } from "../../order/dto/create_order_payment_url.dto";
import { Orders } from "@prisma/client";

export interface PaymentStrategy {
  pay(dto: CreatePaymentUrlDto, order: Orders): Promise<any>;
}
