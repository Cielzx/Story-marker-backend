import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { v2 as cloud } from 'cloudinary';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private UserRepository: UsersRepository,
    private mailerService: MailerService,
  ) {}

  async create(data: CreateUserDto) {
    const findUser = await this.UserRepository.findByEmail(data.email);

    if (findUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.UserRepository.create(data);

    return plainToInstance(User, user);
  }

  async findAll() {
    const users = await this.UserRepository.findAll();
    return plainToInstance(User, users);
  }

  async sendUserAccount(email: string) {
    try {
      const user = await this.UserRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const accessUrl = `story-makers-beta.vercel.app/login`;

      return await this.mailerService.sendMail({
        to: user.email,
        subject: 'Parabéns pela sua compra ^^',
        template: __dirname + '/templates' + '/send-account',
        context: {
          name: user.name,
          email: user.email,
          password: process.env.TEMP_PASSWORD,
          accessUrl,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    const user = await this.UserRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const userEmail = await this.UserRepository.findByEmail(email);
    return userEmail;
  }

  async update(data: UpdateUserDto, id: string, currentUser: any) {
    const updatedUser = await this.UserRepository.update(data, id, currentUser);
    return updatedUser;
  }

  async upload(profile_image: Express.Multer.File, id: string) {
    cloud.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const findUser = await this.UserRepository.findOne(id);

    if (!findUser) {
      throw new NotFoundException('Category not found!');
    }

    const imageUpload = await cloud.uploader.upload(
      profile_image.path,
      { resource_type: 'image' },
      (error, result) => {
        return result;
      },
    );

    const update = await this.UserRepository.update(
      {
        profile_image: imageUpload.secure_url,
      },
      id,
    );

    return update;
  }

  async remove(id: string) {
    await this.UserRepository.delete(id);
    return;
  }
}
