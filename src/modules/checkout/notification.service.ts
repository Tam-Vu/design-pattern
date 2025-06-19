import { Injectable } from '@nestjs/common';
import { Orders, Users } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly chatbotService: ChatbotService,
    private readonly prisma: PrismaService,
  ) {}

  async sendOrderConfirmation(user: Users, order: Orders) {
    try {
      // Get order with items for email
      const orderWithItems = await this.prisma.orders.findUnique({
        where: { id: order.id },
        include: {
          OrderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Send email confirmation
      await this.emailService.sendOrderProcessing({
        user,
        order: {
          ...orderWithItems,
          total_price: Number(orderWithItems.total_price),
          OrderItems: orderWithItems.OrderItems.map((item) => ({
            ...item,
            price: Number(item.price),
            product: item.product,
          })),
        },
      });

      // Update chatbot entity for order tracking
      await this.chatbotService.updateEntityOrderId(order.id);

      return true;
    } catch (error) {
      console.log('Error sending notification:', error);
      return false;
    }
  }
}
