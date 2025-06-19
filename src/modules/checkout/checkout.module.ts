import { Module } from '@nestjs/common';
import { CheckoutFacade } from './checkout.facade';
import { PaymentService } from './payment.service';
import { NotificationService } from './notification.service';
import { ProductsModule } from '../product/product.module';
import { OrdersModule } from '../order/order.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { CheckoutController } from './checkout.controller';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    PrismaModule,
    EmailModule,
    ChatbotModule,
  ],
  providers: [
    CheckoutFacade,
    PaymentService,
    NotificationService,
  ],
  controllers: [
    CheckoutController,
  ],
  exports: [
    CheckoutFacade,
  ],
})
export class CheckoutModule {}
