import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TUserSession } from 'src/common/decorators/user-session.decorator';
import { GetCartDto } from './dto/get_cart.dto';
import { AddToCartDto } from './dto/add_to_cart.dto';
import { UpdateCartDto } from './dto/update_cart.dto';
import { CheckOutDto } from './dto/check_out.dto';
import { OrderService } from '../order/order.service';
import { ConcreteCartItem } from './decorator/concrete-cart-item';
import { GiftWrapDecorator } from './decorator/gift-wrap-decorator';
import { ExpressShippingDecorator } from './decorator/express-shipping-decorator';
import { CartItem } from './decorator/cart-item.interface';

@Injectable()
export class CartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}
  async createCart(session: TUserSession) {
    const existingCart = await this.prisma.carts.findUnique({
      where: { user_id: session.id },
    });
    if (existingCart) {
      throw new BadRequestException('Cart already exists');
    }
    const newCart = this.prisma.carts.create({
      data: {
        user_id: session.id,
      },
    });
    return newCart;
  }
  async getAllCartItems(session: TUserSession, getCartDto: GetCartDto) {
    const { id } = session;
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: id },
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    const cartItems = await this.prisma.cartItems.findMany({
      where: { cart_id: cart.id },
      include: { product: true },
      skip: getCartDto.skip,
      take: getCartDto.take,
      orderBy: { [getCartDto.sortBy]: getCartDto.order },
    });

    // Enhance cart items with decorator pattern
    const enhancedCartItems = cartItems.map((item) => {
      // Get decorations from the database
      const hasGiftWrap = Boolean(item.gift_wrap);
      const hasExpressShipping = Boolean(item.express_shipping);

      // Apply decorators
      let cartItem: CartItem = new ConcreteCartItem(item);

      if (hasGiftWrap) {
        cartItem = new GiftWrapDecorator(cartItem);
      }

      if (hasExpressShipping) {
        cartItem = new ExpressShippingDecorator(cartItem);
      }

      return {
        ...item,
        calculatedPrice: cartItem.getPrice(),
        enhancedDescription: cartItem.getDescription(),
      };
    });

    const itemCount = await this.prisma.cartItems.count({
      where: { cart_id: cart.id },
    });

    return { cartItems: enhancedCartItems, itemCount };
  }
  async addToCart(session: TUserSession, addToCartDto: AddToCartDto) {
    const { productId, quantity, giftWrap, expressShipping } = addToCartDto;
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: session.id },
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Calculate the enhanced price using decorators
    let cartItem: CartItem = new ConcreteCartItem({
      product,
      product_id: productId,
      quantity,
      cart_id: cart.id,
      id: '', // Not relevant for price calculation
    } as any);

    if (giftWrap) {
      cartItem = new GiftWrapDecorator(cartItem);
    }

    if (expressShipping) {
      cartItem = new ExpressShippingDecorator(cartItem);
    }

    const existingCartItem = await this.prisma.cartItems.findFirst({
      where: {
        product_id: productId,
        cart_id: cart.id,
      },
    });

    if (existingCartItem) {
      await this.prisma.cartItems.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
          gift_wrap: giftWrap,
          express_shipping: expressShipping,
        },
      });
    } else {
      await this.prisma.cartItems.create({
        data: {
          product_id: productId,
          cart_id: cart.id,
          quantity: quantity,
          gift_wrap: giftWrap,
          express_shipping: expressShipping,
        },
      });
    }

    return this.prisma.carts.findFirst({
      where: { user_id: session.id },
      include: { CartItems: { include: { product: true } } },
    });
  }
  async deleteCartItem(session: TUserSession, productId: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: session.id },
    });
    const cartItem = await this.prisma.cartItems.findFirst({
      where: {
        product_id: productId,
        cart_id: cart.id,
      },
    });
    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }
    try {
      await this.prisma.cartItems.delete({
        where: {
          id: cartItem.id,
        },
      });
      return this.prisma.carts.findFirst({
        where: { user_id: session.id },
        include: { CartItems: { include: { product: true } } },
      });
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to delete cart item');
    }
  }
  async updateCartItem(session: TUserSession, dto: UpdateCartDto) {
    const { productId, quantity, giftWrap, expressShipping } = dto;
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: session.id },
    });
    const cartItem = await this.prisma.cartItems.findFirst({
      where: {
        product_id: productId,
        cart_id: cart.id,
      },
    });
    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.cartItems.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: quantity,
          gift_wrap: giftWrap,
          express_shipping: expressShipping,
        },
      });
      const updateCart = await tx.carts.findUnique({
        where: { user_id: session.id },
        include: { CartItems: { include: { product: true } } },
      });
      return updateCart;
    });
  }
  async clearCart(session: TUserSession) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: session.id },
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    await this.prisma.cartItems.deleteMany({
      where: {
        cart_id: cart.id,
      },
    });
    return this.prisma.carts.findFirst({
      where: { user_id: session.id },
      include: { CartItems: { include: { product: true } } },
    });
  }
  async checkoutCart(session: TUserSession, dto: CheckOutDto) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: session.id },
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    const cartItems = await this.prisma.cartItems.findMany({
      where: { cart_id: cart.id },
      include: { product: true },
    });
    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    try {
      const order = await this.orderService.createOrder(session, {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        fullName: dto.fullName,
        phoneNumber: dto.phone,
        address: dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
      });
      await this.clearCart(session);
      return order;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to checkout cart');
    }
  }
}
