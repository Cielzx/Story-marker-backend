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
import { IsDate } from 'class-validator';

@Controller('webhook')
export class WebHookController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('payment')
  async handlePayment(@Req() req: Request, @Res() res: Response) {
    const event = req.body;
    try {
      if (
        event.webhook_event_type === 'order_approved' &&
        event.order_status === 'paid'
      ) {
        const customer = event.customer;

        const existingUser = await this.userService.findByEmail(customer.email);
        if (existingUser) {
          return res.status(HttpStatus.BAD_REQUEST).send('User already exists');
        }

        const data = {
          name: customer.full_name,
          email: customer.email,
          password: process.env.TEMP_PASSWORD,
          passwordResetToken: '',
          passwordResetExpires: null,
          is_admin: false,
          profile_image: null,
        };
        console.log(data);
        const newUser = await this.userService.create(data);
        console.log(newUser);
        // await this.userService.sendUserAccount(newUser.email);

        return res
          .status(HttpStatus.OK)
          .send({ event, Succsesc: 'User email sent' });
      }

      return res.status(HttpStatus.BAD_REQUEST).send(event);
    } catch (error) {
      throw new HttpException(
        'Failed to process webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
