import { Injectable } from "@nestjs/common";
import { PaymentStrategy } from "./payment-strategy.interface";
import { CreatePaymentUrlDto } from "../../order/dto/create_order_payment_url.dto";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';
import * as axios from 'axios';
import { Orders } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MomoPaymentStrategy implements PaymentStrategy {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async pay(dto: CreatePaymentUrlDto, order: Orders): Promise<any> {
    const partnerCodeMomo = this.config.get<string>('partner_code_momo');
    const accessKeyMomo = this.config.get<string>('access_key_momo');
    const secretKeyMomo = this.config.get<string>('secret_key_momo');
    const orderInfo = `Thanh toán đơn hàng ${order.id}`;
    const redirectUrl = this.config.get<string>('redirect_url_payment');
    const ipnUrl = this.config.get<string>('ipn_url_momo');
    const requestId = partnerCodeMomo + new Date().getTime();
    const orderId = dto.orderId;
    const amount = Number(order.total_price);
    const requestType = 'captureWallet';
    const extraData = 'FastFood';

    const rawSignature =
      'accessKey=' +
      accessKeyMomo +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCodeMomo +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    const signature = crypto
      .createHmac('sha256', secretKeyMomo)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCodeMomo,
      accessKey: accessKeyMomo,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'en',
    });

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody, 'utf8'),
      },
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      data: requestBody,
    };

    const response = await axios.default(options);

    await this.prisma.orders.update({
      where: {
        id: dto.orderId,
      },
      data: {
        payment_url: response.data.payUrl,
      },
    });

    return response.data;
  }
}
