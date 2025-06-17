import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartsService } from './cart.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersModule } from '../order/order.module';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { GeminiModule } from '../gen_ai/gemini.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PrismaModule,
    OrdersModule,
    ChatbotModule,
    GeminiModule,
    EmailModule,
  ],
  controllers: [CartController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartModule {}
export class CartsModule {}
