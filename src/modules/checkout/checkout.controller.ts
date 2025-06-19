import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserSession, TUserSession } from 'src/common/decorators/user-session.decorator';
import { DOCUMENTATION } from 'src/constants/documentation';
import { StandardResponse } from 'src/utils/response.dto';
import HttpStatusCode from 'src/constants/http_status_code';
import { CheckoutFacade } from './checkout.facade';
import { CheckOutDto } from '../cart/dto/check_out.dto';
import { ChatbotService } from '../chatbot/chatbot.service';

@Controller('checkout')
@ApiTags(DOCUMENTATION.TAGS.CHECKOUT)
export class CheckoutController {
  constructor(
    private readonly checkoutFacade: CheckoutFacade,
    private readonly chatbotService: ChatbotService,
  ) {}

  @Post('place-order')
  async placeOrder(
    @UserSession() session: TUserSession,
    @Body() checkoutDto: CheckOutDto,
  ) {
    const order = await this.checkoutFacade.placeOrder(session, checkoutDto);
    await this.chatbotService.updateEntityOrderId(order.id);
    
    const message = 'Order placed successfully';
    return new StandardResponse(order, message, HttpStatusCode.CREATED);
  }
}
