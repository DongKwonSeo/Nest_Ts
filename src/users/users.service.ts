import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createDto: CreateUserDto): Promise<User> {
    try {
      const { name, password } = createDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const createUser = await this.userRepository.create({
        name,
        password: hashedPassword,
      });
      await this.userRepository.save(createUser);
      return createUser;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('이미있는 아이디');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async siginIn(createDto: CreateUserDto): Promise<{ access_token: string }> {
    try {
      const { name, password } = createDto;
      const checkId = await this.userRepository.findOne({
        where: {
          name,
        },
      });
      const hashPassword = await bcrypt.compare(password, checkId.password);
      const payload = { name };
      const access_token = await this.jwtService.sign(payload);

      if (checkId && (await hashPassword)) {
        return { access_token };
      } else {
        throw new UnauthorizedException(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({});
  }

  async findOneUser(id): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 id의 게시글 정보는 존재하지 않습니다.');
    } else {
      return user;
    }
  }
  async update(id, updateaDto: UpdateUserDto): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!findUser) {
      throw new NotFoundException('해당 id의 게시글 정보는 존재하지 않습니다.');
    }
    await this.userRepository.update(id, updateaDto);
    const updateUser = await this.userRepository.findOne({ where: { id } });

    return updateUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    console.log(result, 'resultresult');
    if (result.affected === 0) {
      throw new NotFoundException('해당하는 id의 게시글 정보가 없습니다.');
    }
    return;
  }
}
