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
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';

@Controller('webhook')
export class WebHookController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('payment')
  async handlePayment(@Req() req: Request, @Res() res: Response) {
    try {
      const event = req.body;
      if (
        event.webhook_event_type === 'order_approved' &&
        event.order_status === 'paid'
      ) {
        const customer = event.Customer;
        const { id, start_date, next_payment, status, plan } =
          event.Subscription;

        const existingUser = await this.userService.findByEmail(customer.email);
        if (existingUser) {
          return res.status(HttpStatus.BAD_REQUEST).send('User already exists');
        }

        const data: CreateUserDto = {
          name: customer.first_name,
          email: customer.email,
          password: process.env.TEMP_PASSWORD,
          passwordResetToken: '',
          passwordResetExpires: null,
          is_admin: false,
          profile_image: null,
        };

        const newUser = await this.userService.create(data);

        const updatedPlan = await this.prismaService.plan.upsert({
          where: { id: plan.id },
          create: {
            id: plan.id,
            name: plan.name,
            frequency: plan.frequency,
          },
          update: {
            name: plan.name,
            frequency: plan.frequency,
          },
        });

        const updatedSubscription =
          await this.prismaService.subscription.upsert({
            where: { id },
            create: {
              id,
              start_date: new Date(start_date),
              next_payment: new Date(next_payment),
              status,
              planId: updatedPlan.id,
            },
            update: {
              start_date: new Date(start_date),
              next_payment: new Date(next_payment),
              status,
              planId: updatedPlan.id,
            },
          });

        await this.prismaService.user.update({
          where: { email: newUser.email },
          data: {
            subscriptionId: updatedSubscription.id,
          },
        });

        return res
          .status(HttpStatus.OK)
          .send({ newUser, Success: 'User Created' });
      }

      return res.status(HttpStatus.BAD_REQUEST).send(event);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to process webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('subscription')
  async handleSubscription(@Req() req: Request, @Res() res: Response) {
    try {
      const event = req.body;

      if (
        event.webhook_event_type === 'subscription_renewed' &&
        event.order_status === 'paid'
      ) {
        const { id, start_date, next_payment, status, plan } =
          event.Subscription;
        const updatedSubscription =
          await this.prismaService.subscription.update({
            where: { id },
            data: {
              start_date: new Date(start_date),
              next_payment: new Date(next_payment),
              status,
            },
          });

        await this.prismaService.user.update({
          where: { email: event.Customer.email },
          data: {
            subscriptionId: updatedSubscription.id,
          },
        });

        return res
          .status(HttpStatus.OK)
          .send({ Success: 'User subscription renewed' });
      }
    } catch (error) {
      throw new HttpException(
        'Failed to process webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
