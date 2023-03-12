import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createDto: CreateUserDto): Promise<User> {
    return this.usersService.signUp(createDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('/login')
  siginIn(@Body() createDto: CreateUserDto): Promise<{ access_token: string }> {
    return this.usersService.siginIn(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneUser(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateaDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
