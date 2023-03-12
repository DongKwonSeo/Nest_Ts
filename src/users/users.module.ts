import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { DatabaseModule } from 'src/database/module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'heelo',
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...userProviders],
})
export class UsersModule {}
