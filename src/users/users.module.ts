import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { DatabaseModule } from 'src/database/module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './local.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'hello',
      signOptions: { expiresIn: 60 * 60 },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...userProviders, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
