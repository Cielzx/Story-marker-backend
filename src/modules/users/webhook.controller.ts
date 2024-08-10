import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Request, Response } from 'express';

@Controller('webhook')
export class WebHookController {
  constructor(private readonly userService: UserService) {}

  @Post('payment')
  async handlePayment(@Req() req: Request, @Res() res: Response) {
    const event = req.body;
    console.log(event);
    try {
      if (event.type === 'payment_sucessfull') {
        return res.status(HttpStatus.OK).send(event);
      }

      return res.status(HttpStatus.OK).send(event);
    } catch (error) {
      throw new HttpException(
        'Failed to process webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
