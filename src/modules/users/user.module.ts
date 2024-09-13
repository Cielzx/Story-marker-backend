import { BadRequestException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersRepository } from './repositories/user.repository';
import { UsersPrismaRepo } from './repositories/prisma/user.prisma.repository';
import { UsersController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { WebHookController } from './webhook.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './temp',
        filename: (_, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (_, file, cb) => {
        const allowedMimeTypes = [
          'image/heif',
          'image/heic',
          'image/jpeg',
          'image/png',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          return cb(null, true);
        } else {
          return cb(new BadRequestException('Format not suported'), false);
        }
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Story Maker<No Reply>" <noreply@your-email.com>',
      },
      template: {
        dir: join(__dirname, '..', '..', '..', process.env.TEMPLATE_USER),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [UsersController, WebHookController],
  providers: [
    UserService,
    PrismaService,
    {
      provide: UsersRepository,
      useClass: UsersPrismaRepo,
    },
  ],
  exports: [UserService, UsersRepository],
})
export class UsersModule {}
