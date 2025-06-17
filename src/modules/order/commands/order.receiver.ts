import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TUserSession } from 'src/common/decorators/user-session.decorator';
import { CreateOrderDto } from '../dto/create_order.dto';
import { OrderStatus, PaymentMethod, ReviewState, ReviewType } from '@prisma/client';
import { ORDER_STATUS } from 'src/constants/enum';
import { EmailService } from '../../email/email.service';
import { GeminiService } from '../../gen_ai/gemini.service';
import { UpdateOrderStatusDto } from '../dto/update_order_status.dto';
import HttpStatusCode from 'src/constants/http_status_code';
import { CreateReviewDto } from '../dto/create_review.dto';

@Injectable()
export class OrderReceiver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly geminiService: GeminiService,
  ) {}

  // Place order method
  async place(session: TUserSession, dto: CreateOrderDto) {
    // Implementation details for placing an order
    // This reuses the transaction logic from the original service
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.products.findMany({
      where: { id: { in: productIds } },
    });
    const cart = await this.prisma.carts.findFirstOrThrow({
      where: { user_id: session.id },
    });
    const cartItems = await this.prisma.cartItems.findMany({
      where: { cart_id: cart.id, product_id: { in: productIds } },
    });
    const cartItemIds = cartItems.map((item) => item.id);
    
    const user = await this.prisma.users.findUnique({
      where: { id: session.id },
    });
    const productPriceMap = new Map(
      products.map((product) => [
        product.id,
        {
          price: product.price,
          finalPrice: product.final_price ?? product.price,
        },
      ]),
    );

    return await this.prisma.$transaction(
      async (tx) => {
        await tx.cartItems.deleteMany({
          where: {
            id: { in: cartItemIds },
          },
        });
        let order = undefined;
        if (dto.paymentMethod === 'CASH') {
          const orderTemp = await tx.orders.create({
            data: {
              user_id: session.id,
              full_name: dto.fullName,
              phone_number: dto.phoneNumber,
              address: dto.address,
              payment_method: dto.paymentMethod,
              status: ORDER_STATUS.PROCESSING as OrderStatus,
            },
          });
          const orderItems = dto.items.map((item) => {
            const { price, finalPrice } = productPriceMap.get(item.productId);
            const totalPrice = Number(finalPrice) * item.quantity;
            return {
              order_id: orderTemp.id,
              product_id: item.productId,
              quantity: item.quantity,
              price,
              total_price: totalPrice,
            };
          });
          await tx.orderItems.createMany({ data: orderItems });
          const totalPrice = orderItems.reduce(
            (acc, item) => acc + item.total_price,
            0,
          );
          const updatedOrder = await tx.orders.update({
            where: { id: orderTemp.id },
            data: {
              total_price: totalPrice,
            },
            include: {
              OrderItems: {
                include: {
                  product: true,
                },
              },
            },
          });
          order = await tx.orders.findFirst({
            where: { id: orderTemp.id },
            include: {
              OrderItems: {
                include: {
                  product: true,
                },
              },
            },
          });
          await this.emailService.sendOrderProcessing({
            user: user,
            order: {
              ...order,
              total_price: Number(order.total_price),
              OrderItems: order.OrderItems.map((item) => ({
                ...item,
                price: Number(item.price),
                product: item.product,
              })),
            },
          });
          return updatedOrder;
        } else {
          const orderTemp = await tx.orders.create({
            data: {
              user: { connect: { id: session.id } },
              full_name: dto.fullName,
              phone_number: dto.phoneNumber,
              payment_method: dto.paymentMethod,
              address: dto.address,
            },
          });
          order = orderTemp;
        }
        const orderItems = dto.items.map((item) => {
          const { price, finalPrice } = productPriceMap.get(item.productId);
          const totalPrice = Number(finalPrice) * item.quantity;
          return {
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity,
            price,
            total_price: totalPrice,
          };
        });
        await tx.orderItems.createMany({ data: orderItems });
        const totalPrice = orderItems.reduce(
          (acc, item) => acc + item.total_price,
          0,
        );
        const updatedOrder = await tx.orders.update({
          where: { id: order.id },
          data: {
            total_price: totalPrice,
          },
          include: {
            OrderItems: {
              include: {
                product: true,
              },
            },
          },
        });
        return updatedOrder;
      },
      {
        timeout: 20000,
      },
    );
  }

  // Cancel order method
  async cancel(id: string, userId: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id: id, user_id: userId },
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new BadRequestException('Order already cancelled');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.orders.update({
          where: { id },
          data: { status: ORDER_STATUS.CANCELLED as OrderStatus },
        });
        return await tx.orders.findUnique({
          where: { id },
        });
      });
    } catch (error) {
      console.log('Error:', error);
      throw new BadRequestException('Failed to cancel order');
    }
  }
  
  // Update order status method
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    if (
      order.status === ORDER_STATUS.CANCELLED ||
      order.status === ORDER_STATUS.REJECT
    ) {
      throw new BadRequestException('Order already cancelled or rejected');
    }
    
    if (dto.status === ORDER_STATUS.REJECT) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const updatedOrder = await tx.orders.update({
            where: { id },
            data: { status: dto.status },
          });
          const order = await tx.orders.findUnique({
            where: { id: updatedOrder.id },
            include: {
              OrderItems: {
                include: {
                  product: true,
                },
              },
            },
          });
          const user = await tx.users.findUnique({
            where: { id: order.user_id },
          });
          await this.emailService.sendOrderRejected({
            user,
            order: {
              ...order,
              total_price: Number(order.total_price),
              OrderItems: order.OrderItems.map((item) => ({
                ...item,
                price: Number(item.price),
                product: item.product,
              })),
            },
          });
          return updatedOrder;
        });
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Failed to update order status');
      }
    }

    if (dto.status === ORDER_STATUS.SUCCESS) {
      const orderItems = await this.prisma.orderItems.findMany({
        where: { order_id: id },
      });

      for (const orderItem of orderItems) {
        const product = await this.prisma.products.findUnique({
          where: { id: orderItem.product_id },
          select: { sold_quantity: true },
        });

        await this.prisma.products.update({
          where: { id: orderItem.product_id },
          data: { sold_quantity: product.sold_quantity + orderItem.quantity },
        });
      }
      const order = await this.prisma.orders.findUnique({
        where: { id: id },
        include: {
          OrderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      const user = await this.prisma.users.findUnique({
        where: { id: order.user_id },
      });
      await this.emailService.sendOrderSuccess({
        user,
        order: {
          ...order,
          total_price: Number(order.total_price),
          OrderItems: order.OrderItems.map((item) => ({
            ...item,
            price: Number(item.price),
            product: item.product,
          })),
        },
      });
    } else if (dto.status === ORDER_STATUS.DELIVERED) {
      const order = await this.prisma.orders.findUnique({
        where: { id: id },
        include: {
          OrderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      const user = await this.prisma.users.findUnique({
        where: { id: order.user_id },
      });
      await this.emailService.sendOrderDelivering({
        user,
        order: {
          ...order,
          total_price: Number(order.total_price),
          OrderItems: order.OrderItems.map((item) => ({
            ...item,
            price: Number(item.price),
            product: item.product,
          })),
        },
      });
    }
    return await this.prisma.orders.update({
      where: { id },
      data: { status: dto.status },
    });
  }
  
  // Create review method
  async review(
    session: TUserSession,
    dto: CreateReviewDto,
    id: string,
    orderDetailId: string,
    productId: string,
  ) {
    const order = await this.prisma.orders.findUnique({
      where: { user_id: session.id, id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const orderDetail = await this.prisma.orderItems.findUnique({
      where: { id: orderDetailId },
    });
    if (!orderDetail) {
      throw new NotFoundException('Order detail not found');
    }
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Book not found');
    }
    const type = await this.geminiService.analyseComment(
      dto.title + ' ' + dto.description,
    );
    if (type.trim() === ReviewType.TOXIC) {
      throw new HttpException(
        'Your comment is toxic, please try again',
        HttpStatusCode.BAD_REQUEST,
      );
    }
    const is_hidden = type.trim() === ReviewType.NEGATIVE;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const newTotalReviews = product.total_reviews + 1;
        const newAvgStars =
          (Number(product.avg_stars) * product.total_reviews + dto.star) /
          newTotalReviews;
        const review = await tx.reviews.create({
          data: {
            user_id: session.id,
            product_id: product.id,
            rating: dto.star,
            description: dto.description,
            title: dto.title,
            order_item_id: orderDetailId,
            type: type.trim() as ReviewType,
            is_hidden: is_hidden,
          },
          include: {
            product: true,
          },
        });
        await tx.products.update({
          where: { id: product.id },
          data: {
            total_reviews: newTotalReviews,
            avg_stars: newAvgStars,
          },
        });
        await tx.orderItems.update({
          where: { id: orderDetailId },
          data: { review_status: ReviewState.REVIEWED, review_id: review.id },
        });
        const orderItems = await tx.orderItems.findMany({
          where: { order_id: id },
        });
        let flag = true;
        for (const item of orderItems) {
          if (item.review_status !== ReviewState.REVIEWED) {
            flag = false;
            break;
          }
        }
        if (flag) {
          await tx.orders.update({
            where: { id },
            data: { review_state: ReviewState.REVIEWED },
          });
        }
        return review;
      });
    } catch (error) {
      console.log('Error:', error);
      throw new BadRequestException({
        message: 'Failed to add rating review',
      });
    }
  }
}
