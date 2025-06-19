import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { MomoPaymentStrategy } from "./strategies/momo-payment.strategy";
import { VNPayPaymentStrategy } from "./strategies/vnpay-payment.strategy";
import { ZaloPayPaymentStrategy } from "./strategies/zalopay-payment.strategy";
import { Payment } from "./payment";

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    MomoPaymentStrategy,
    VNPayPaymentStrategy,
    ZaloPayPaymentStrategy,
    Payment
  ],
  exports: [
    MomoPaymentStrategy,
    VNPayPaymentStrategy,
    ZaloPayPaymentStrategy,
    Payment
  ]
})
export class PaymentModule {}
