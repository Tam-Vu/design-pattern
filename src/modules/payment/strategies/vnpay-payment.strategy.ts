import { Injectable } from "@nestjs/common";
import { PaymentStrategy } from "./payment-strategy.interface";
import { CreatePaymentUrlDto } from "../../order/dto/create_order_payment_url.dto";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { Orders } from "@prisma/client";

@Injectable()
export class VNPayPaymentStrategy implements PaymentStrategy {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async pay(dto: CreatePaymentUrlDto, order: Orders): Promise<any> {
    // VNPay implementation would go here
    // This is a placeholder for demonstration purposes
    const paymentUrl = `https://example-vnpay.com/pay/${dto.orderId}`;
    
    await this.prisma.orders.update({
      where: {
        id: dto.orderId,
      },
      data: {
        payment_url: paymentUrl,
      },
    });

    return {
      payUrl: paymentUrl
    };
  }
}
