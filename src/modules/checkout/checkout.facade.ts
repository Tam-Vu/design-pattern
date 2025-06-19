import { Injectable } from '@nestjs/common';
import { ProductsService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { PaymentService } from './payment.service';
import { NotificationService } from './notification.service';
import { TUserSession } from 'src/common/decorators/user-session.decorator';
import { CheckOutDto } from '../cart/dto/check_out.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutFacade {
  constructor(
    private readonly productService: ProductsService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  async placeOrder(session: TUserSession, checkoutDto: CheckOutDto) {
    try {
      // 1. Get the cart items
      const cart = await this.prisma.carts.findFirst({
        where: { user_id: session.id },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      const cartItems = await this.prisma.cartItems.findMany({
        where: { cart_id: cart.id },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const hasStock = await this.productService.hasEnoughStock(cartItems);
      if (!hasStock) {
        throw new Error('Some products are out of stock');
      }

      const order = await this.orderService.createOrder(session, {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        fullName: checkoutDto.fullName,
        phoneNumber: checkoutDto.phone,
        address: checkoutDto.shippingAddress,
        paymentMethod: checkoutDto.paymentMethod,
      });

      if (checkoutDto.paymentMethod !== 'CASH') {
        await this.paymentService.processPayment(order, checkoutDto.paymentMethod);
      }

      await this.productService.decreaseStock(cartItems);

      const user = await this.prisma.users.findUnique({
        where: { id: session.id },
      });
      await this.notificationService.sendOrderConfirmation(user, order);

      await this.prisma.cartItems.deleteMany({
        where: { cart_id: cart.id },
      });

      return order;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to complete checkout: ' + error.message);
    }
  }
}
