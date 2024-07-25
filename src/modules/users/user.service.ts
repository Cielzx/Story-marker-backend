import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v2 as cloud } from 'cloudinary';

@Injectable()
export class UserService {
  constructor(private UserRepository: UsersRepository) {}

  async create(data: CreateUserDto) {
    const findUser = await this.UserRepository.findByEmail(data.email);

    if (findUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.UserRepository.create(data);

    return user;
  }

  async findAll() {
    const users = await this.UserRepository.findAll();
    return users;
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
